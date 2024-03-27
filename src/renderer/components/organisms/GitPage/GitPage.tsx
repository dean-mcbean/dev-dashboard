/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from "react";
import { useOutput } from "../../../contexts/OutputContext";
import { useStorage } from "../../../contexts/StorageContext";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { branchButton, branchListContainer, diagramContainer, gitPageContainer, realDiagramContainer } from "./GitPage.styles";
import { select, tree, hierarchy, linkHorizontal, scaleOrdinal, schemeCategory10, linkVertical } from 'd3';

type CommitObject = {
  graph: string,
  commitHash: string,
  message: string,
  author: string,
  relativeTime: string,
  tags: string[],
  branches: string[],
  column: number | undefined
}

const processRefs = (refs: string) => {
  return refs.replace("(", "").replace(")", "").split(",").map(ref => ref.trim());
}

export const GitPage = () => {
  const { currentFolder } = useStorage();
  const { runCommand } = useOutput();
  const [branches, setBranches] = useState<Array<string>>([]);
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  const switchToBranch = (branch: string) => {
    runCommand(`git checkout ${branch}`);
    setActiveBranch(branch);
  };

  const fetchBranches = () => {
    runCommand("git branch --format=%(refname:short)", true).then((output) => {
      const branchList = output.split("\n").filter(Boolean);
      setBranches(branchList);
    });
  };

  const fetchActiveBranch = () => {
    runCommand("git branch --show-current", true).then((output) => {
      setActiveBranch(output.trim());
    });
  }

  function handleOnDragEnd(result: DropResult) {
    console.log(result, branches)
    if (!result.destination) return;
    const items = Array.from(branches);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setBranches(items);
  }


  const createDiagram = (commits: CommitObject[]) => {
    const allBranchesInCommits = commits.map(commit => commit.branch);
    const uniqueBranches = Array.from(new Set(allBranchesInCommits));
    //clear the diagram container
    select("#diagramContainer").selectAll("*").remove();
    const data = { name: "root", children: commits};
    // get width and height from the container
    const padding = 20;
    const ySeparation = 20;
    const width = (document.getElementById("diagramContainer")?.clientWidth || 800)  - padding * 3;
    const branchColorsAndPositions = uniqueBranches.map((branch, index) => {
      const commitsInBranch = commits.filter(commit => commit.branch === branch);
      return { branch, color: schemeCategory10[index % 10], y: width / uniqueBranches.length * index + padding, commits: commitsInBranch.length, commitList: commitsInBranch };
    });
    branchColorsAndPositions.sort((a, b) => b.commits - a.commits);
    console.log(branchColorsAndPositions)
    const height = commits.length * ySeparation;
    const svg = select("#diagramContainer").append("svg").attr("width", width+ padding * 2).attr("height", height+ padding * 2);
    const root = hierarchy(data);
    const treeLayout = tree().size([width, height]); // subtract padding from width and height
    treeLayout(root as any);
    const linkGenerator = linkVertical() // change to linkHorizontal
      .x((d: any) => {
        const branchColor = branchColorsAndPositions.find(item => item.branch === d.data.branch);
        return branchColor ? branchColor.y : 0;
      }) // add padding to x coordinate
      .y((d: any) => height - d.y + padding); // add padding to y coordinate
    svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", linkGenerator as any)
      .style("stroke", (d: any) => {
        const branchColor = branchColorsAndPositions.find(item => item.branch === d.target.data.branch);
        return branchColor ? branchColor.color : "grey";
      })
      .style("fill", "none");
    svg.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("cx", (d: any) => {
        const branchColor = branchColorsAndPositions.find(item => item.branch === d.data.branch);
        return branchColor ? branchColor.y : 0;
      }) // add padding to x coordinate
      .attr("cy", (d: any) => height - d.y + padding) // add padding to y coordinate
      .attr("r", 5)
      .style("fill", (d: any) => {
        const branchColor = branchColorsAndPositions.find(item => item.branch === d.data.branch);
        return branchColor ? branchColor.color : "grey";
      });
  };

  const fetchCommitHistory = () => {
    //runCommand("git log --all --branches --pretty=format:\"%h|%s|%D|%an\"", true)
    runCommand("git log --graph --pretty=format:▼%h▼%d▼%s▼%an▼%ad --abbrev-commit --all --date=relative", true).then((output) => {
      const commitLines = output.split("\n");
      console.log(commitLines)
      let persistent_branches: string[][] = [];
      persistent_branches.push(processRefs(commitLines[0].split("▼")[2]).map(branch => branch.replaceAll('HEAD -> ','').trim()));
      let next_commits: string[] = [];
      const commits: CommitObject[] = commitLines.flatMap(line => {
        const split_line = line.split("▼");
        let [graph, commitHash, pointers, message, author, relativeTime] = split_line;
        let tags: string[] = [];
        let branch_pointers: string[] = [];
        if (pointers) {
          const split_pointers = processRefs(pointers);
          tags = split_pointers.filter(pointer => pointer.startsWith('tag: ')).map(tag => tag.replace('tag: ', ''));
          branch_pointers = split_pointers.filter(pointer => !pointer.startsWith('tag: ')).map(branch => branch.trim());
        }
        let column = undefined;
        let branches: string[] = [];
        let split_graph = undefined;
        if (graph) {
          split_graph = graph.replaceAll(' ', '').split("");
          column = split_graph.indexOf("*");
          if (column === -1) {
            column = undefined;
          }
          if (column !== undefined && persistent_branches[column]) {
            branches = persistent_branches[column];
          }
        }


        return { split_graph, branches, branch_pointers, commitHash, message, author, relativeTime, tags,  column, graph };
      });

      console.log(commits)
      createDiagram(commits);
    });
  };


  useEffect(() => {
    fetchBranches();
    fetchActiveBranch();
    fetchCommitHistory();
  }, [currentFolder]);

  return (
    <div css={gitPageContainer}>
      <div css={branchListContainer}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="buttons">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {branches.map((branch, index) => (
                  <Draggable key={branch} draggableId={branch} index={index} >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={() => switchToBranch(branch)} css={branchButton({active: activeBranch == branch})}>
                      {branch}
                    </div>
                  )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div css={diagramContainer}>
        <div css={realDiagramContainer} id="diagramContainer">
          </div>
      </div>
    </div>
  );
};
