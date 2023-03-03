import { Flex, Heading, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";

const Column = dynamic(() => import("../src/Column"), { ssr: false });

const reorderColumnList = (sourceCol, startIndex, endIndex) => {
  const newTaskIds = Array.from(sourceCol.taskIds);
  const [removed] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    taskIds: newTaskIds,
  };
  return newColumn;
};

export default function Home() {
  const [state, setState] = useState(initialData);

  // 드래그가 끝나는 시점에 발동되는 함수,
  const onDragEnd = (result) => {
    const { destination, source } = result;

    // 만약 유저가 알수 없는 공간에 drop을 하게 될 경우
    if (!destination) return;

    // 만약 유저가 dnd를 같은 장소에 할 경우
    if (
      destination.droppableId == source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // 만약 유저가 동일한 열에서 다른 위치로 이동할 경우
    const sourceCol = state.columns[source.droppableId];
    const destinationCol = state.columns[destination.droppableId];
    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };
      setState(newState);
      return;
    }
    // 만약 유저가 한 열에서 다른 열로 이동하는 경우
    const startTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    };
    const endTaskIds = Array.from(destinationCol.taskIds);
    endTaskIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds,
    };
    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };
    setState(newState);
  };

  return (
    // react-beautiful-dnd를 설치 후 DragDropContext를 씌워줌
    <DragDropContext onDragEnd={onDragEnd}>
      {/* 전체를 bg를 검은색, 글씨는 흰색으로 설정 // 이모든것들은 theme.js에 정의되어 있다. */}
      <Flex
        flexDir="column"
        bg="main-bg"
        minH="100vh"
        w="full"
        color="white-text"
        pb="2rem" //pading bottom
      >
        {/**Header 부분 */}
        <Flex py="4rem" flexDir="column" align="center">
          <Heading fontSize="3xl" fontWeight={600}>
            React Beautiful Drag and Drop
          </Heading>
          {/**Header 아래 부제목*/}
          <Text fontSize="20px" fontWeight={600} color="subtle-text">
            reat-beautiful-dnd
          </Text>
        </Flex>

        <Flex justify="space-between" px="4rem">
          {state.columnOrder.map((colunId) => {
            const column = state.columns[colunId];
            const tasks = column.taskIds.map((taskIds) => state.tasks[taskIds]);

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
          {/*{src/Column.js} 에서 가져온다*/}
        </Flex>
      </Flex>
    </DragDropContext>
  );
}

const initialData = {
  tasks: {
    1: { id: 1, content: "Metacycle App PIP" },
    2: { id: 2, content: "광고_1" },
    3: { id: 3, content: "광고_2" },
    4: { id: 4, content: "광고_3" },
    5: { id: 5, content: "광고_4" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "TO-DO",
      taskIds: [1, 2, 3, 4, 5],
    },
    "column-2": {
      id: "column-2",
      title: "IN-PROGRESS",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "COMOLETED",
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1", "column-2", "column-3"],
};
