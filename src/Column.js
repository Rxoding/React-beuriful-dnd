import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

export const Column = ({ column, tasks }) => {
  return (
    // {/*안에 큰 박스를 설정하는 부분*/}
    <Flex rounded="3px" bg="column-bg" w="500px" h="620px" flexDir="column">
      {/*큰 박스안 제목*/}
      <Flex
        align="center"
        h="60px"
        bg="column-header-bg"
        rounded="3px 3px 0 0"
        px="1.5rem"
        mb="1.5rem"
      >
        <Text fontSize="17px" fontWeight={600} color="subtle-text">
          {column.title}
        </Text>
      </Flex>

      <Droppable droppableId={column.id}>
        {(droppableProvided, droppableSnapshot) => (
          // {/*column 생성하는 곳*/}
          <Flex
            px="1.5rem"
            flex={1}
            flexDir="column"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                {(draggableProvieded, draggableSnapshot) => (
                  <Flex
                    mb="1rem"
                    h="72px"
                    bg="card-bg"
                    rounded="3px"
                    p="1.5rem"
                    outline="2px solid"
                    outlineColor={
                      draggableSnapshot.isDragging
                        ? "card-border"
                        : "transparent"
                    }
                    boxShadow={
                      draggableSnapshot.isDragging
                        ? "0 5px 10px rgba(0,0,0, 0.6)"
                        : "unset"
                    }
                    ref={draggableProvieded.innerRef}
                    {...draggableProvieded.draggableProps}
                    {...draggableProvieded.dragHandleProps}
                  >
                    <Text>{task.content}</Text>
                  </Flex>
                )}
              </Draggable>
            ))}
          </Flex>
        )}
      </Droppable>
    </Flex>
  );
};

export default Column;
