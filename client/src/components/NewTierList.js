import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import NestedList from "./NestedList";
import static_items from "./data";

// a little function to help us with reordering the result


export default function Index() {

const data = { items: static_items}

const [state, setState] = useState(data)

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    console.log(result)
  
    return result;
  };
  
  const grid = 8;
  
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
  
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",
  
    // styles we need to apply on draggables
    ...draggableStyle
  });
  
  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 200
  });

  function onDragEnd(result) {
    // dropped outside the list
    console.log(result);

    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (result.type === "droppableItem") {
      const items = reorder(state.items, sourceIndex, destIndex);
      console.log(items)
      console.log({items})
      setState({items});

    } else if (result.type === "droppableSubItem") {
      const itemSubItemMap = state.items.reduce((acc, item) => {
        acc[item.id] = item.subItems;
        return acc;
      }, {});

      const sourceParentId = parseInt(result.source.droppableId);
      const destParentId = parseInt(result.destination.droppableId);

      const sourceSubItems = itemSubItemMap[sourceParentId];
      const destSubItems = itemSubItemMap[destParentId];

      let newItems = [...state.items];
      console.log(newItems)

      /** In this case subItems are reOrdered inside same Parent */
      if (sourceParentId === destParentId) {
        const reorderedSubItems = reorder(
          sourceSubItems,
          sourceIndex,
          destIndex
        );

        console.log(reorderedSubItems)

        newItems = newItems.map(item => {
          console.log(item.id)
          console.log(sourceParentId)
          
          if (parseInt(item.id) === sourceParentId) {
            console.log(reorderedSubItems)
            item.subItems = reorderedSubItems;
          }

          console.log(item.subItems)
          console.log(item)

          return item;
        });


        setState({
          items: newItems
        });

        console.log(state.items)

      } else {

        let newSourceSubItems = [...sourceSubItems];
        const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

        let newDestSubItems = [...destSubItems];

        newDestSubItems.splice(destIndex, 0, draggedItem);

        newItems = newItems.map(item => {
          if (parseInt(item.id) === sourceParentId) {
            item.subItems = newSourceSubItems;
          } else if (parseInt(item.id) === destParentId) {
            item.subItems = newDestSubItems;
          }
          return item;
        });

        setState({
          items: newItems
        });

      }
    }
  }

  console.log(state.items)
  const secondaryItems = state.items.map((item,index) => {
    if(index === 0) {
      return null;
    }

    return <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {item.content}
                        <span
                          {...provided.dragHandleProps}
                          style={{
                            display: "inline-block",
                            margin: "0 10px",
                            border: "1px solid #000"
                          }}
                        >
                          Drag
                        </span>
                        <NestedList
                          subItems={item.subItems}
                          type={item.id}
                        />
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Draggable> });

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" type="droppableItem">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={{...getListStyle(snapshot.isDraggingOver), display:'flex'}}
            >
              
              {state.items.map((item, index) => {
                  if(index !== 0) {
                    return null;
                  }

                  return <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {item.content}
                        <span
                          {...provided.dragHandleProps}
                          style={{
                            display: "inline-block",
                            margin: "0 10px",
                            border: "1px solid #000"
                          }}
                        >
                          Drag
                        </span>
                        <NestedList
                          subItems={item.subItems}
                          type={item.id}
                        />
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Draggable>
            })}

            <div>
              {secondaryItems}
            </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }