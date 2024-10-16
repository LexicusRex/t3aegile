"use client";

import { useState } from "react";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
// import { v4 as uuidv4 } from 'uuid';
import {
  CheckCircle,
  Circle,
  CircleDashed,
  CircleDot,
  ListFilterIcon,
  Loader2,
  SlidersHorizontalIcon,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Container from "./container";
import Items from "./item";

type DNDType = {
  id: UniqueIdentifier;
  title: string;
  status: {
    value: string;
    label: string;
    icon: LucideIcon;
  };
  items: {
    id: UniqueIdentifier;
    title: string;
  }[];
};

export default function DndListContext() {
  const [containers, setContainers] = useState<DNDType[]>([
    {
      id: "container-0",
      title: "Backlog",
      status: {
        value: "backlog",
        label: "Backlog",
        icon: CircleDashed,
      },
      items: [
        {
          id: "item-0",
          title: "Add global context provider to keep track of unsaved changes",
        },
        {
          id: "item-1",
          title: "Add UTC support globally and render datetime on client side",
        },
        {
          id: "item-2",
          title:
            "Fix intermittent useContext error when opening taskboards in new tabs",
        },
        {
          id: "item-3",
          title: "Add API endpoints with support for paginated fetching",
        },
        { id: "item-4", title: "Add responsive inbox drawer" },
        {
          id: "item-5",
          title: "Add alert confirmation dialog form to delete actions",
        },
        {
          id: "item-6",
          title:
            "Add course table component displaying assessments and weightings",
        },
        {
          id: "item-7",
          title:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo doloribus voluptas, debitis quod asperiores consequuntur labore eligendi harum ipsa aperiam, maiores reiciendis laborum dolorem et dignissimos voluptatum minima vero soluta!",
        },
        {
          id: "item-8",
          title:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo doloribus voluptas, debitis quod asperiores consequuntur labore eligendi harum ipsa aperiam, maiores reiciendis laborum dolorem et dignissimos voluptatum minima vero soluta!",
        },
        {
          id: "item-9",
          title:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo doloribus voluptas, debitis quod asperiores consequuntur labore eligendi harum ipsa aperiam, maiores reiciendis laborum dolorem et dignissimos voluptatum minima vero soluta!",
        },
        { id: "item-10", title: "there10" },
        { id: "item-11", title: "there11" },
        { id: "item-12", title: "there12" },
        { id: "item-13", title: "there13" },
        { id: "item-14", title: "there14" },
        { id: "item-15", title: "there15" },
        { id: "item-16", title: "there16" },
        { id: "item-17", title: "there17" },
        { id: "item-18", title: "there18" },
        { id: "item-19", title: "there19" },
        { id: "item-20", title: "there20" },
        { id: "item-21", title: "there21" },
        { id: "item-22", title: "there22" },
        { id: "item-23", title: "there23" },
        { id: "item-24", title: "there24" },
        { id: "item-25", title: "there25" },
        { id: "item-26", title: "there26" },
        { id: "item-27", title: "there27" },
      ],
    },
    {
      id: "container-1",
      title: "Todo",
      status: {
        value: "todo",
        label: "Todo",
        icon: Circle,
      },
      items: [],
    },
    {
      id: "container-2",
      title: "In Progress",
      status: {
        value: "in_progress",
        label: "In Progress",
        icon: CircleDot,
      },
      items: [],
    },
    {
      id: "container-3",
      title: "In Review",
      status: {
        value: "in_review",
        label: "In Review",
        icon: Loader2,
      },
      items: [
        { id: "item-28", title: "there28" },
        { id: "item-29", title: "there29" },
        { id: "item-30", title: "there30" },
        { id: "item-31", title: "there31" },
        { id: "item-32", title: "there32" },
        { id: "item-33", title: "there33" },
        { id: "item-34", title: "there34" },
        { id: "item-35", title: "there35" },
      ],
    },
    {
      id: "container-4",
      title: "Done",
      status: {
        value: "done",
        label: "Done",
        icon: CheckCircle,
      },
      items: [],
    },
    {
      id: "container-5",
      title: "Cancelled",
      status: {
        value: "cancelled",
        label: "Cancelled",
        icon: XCircle,
      },
      items: [],
    },
  ]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();
  // const [containerName, setContainerName] = useState("");
  const [itemName, setItemName] = useState("");
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const [overContainerId, setOverContainerId] =
    useState<UniqueIdentifier | null>(null);
  const [sourceContainerId, setSourceContainerId] =
    useState<UniqueIdentifier | null>(null);

  // const onAddContainer = () => {
  //   if (!containerName) return;
  //   const id = `container-${Math.random().toString(36).slice(2)}`;
  //   setContainers([
  //     ...containers,
  //     {
  //       id,
  //       title: containerName,
  //       items: [],
  //     },
  //   ]);
  //   setContainerName("");
  // };
  const onAddItem = () => {
    if (!itemName) return;
    const id = `item-${Math.floor(Math.random() * 90 + 10)}`;
    const container = containers.find((item) => item.id === currentContainerId);
    if (!container) return;
    container.items.push({
      id,
      title: itemName,
    });
    setContainers([...containers]);
    setItemName("");
    setShowAddItemModal(false);
  };

  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === "container") {
      return containers.find((item) => item.id === id);
    }
    if (type === "item") {
      return containers.find((container) =>
        container.items.find((item) => item.id === id),
      );
    }
  }

  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container) return "";
    const item = container.items.find((item) => item.id === id);
    if (!item) return "";
    return item.title;
  };

  const findItemStatus = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item");
    if (!container)
      return {
        value: "backlog",
        label: "Backlog",
        icon: CircleDashed,
      };
    return container.status;
  };

  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container");
    if (!container) return "";
    return container.title;
  };

  // const findContainerItems = (id: UniqueIdentifier | undefined) => {
  //   const container = findValueOfItems(id, "container");
  //   if (!container) return [];
  //   return container.items;
  // };

  // DND Related handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
    const activeContainer = findValueOfItems(active.id, "item");
    if (!activeContainer) return;
    setSourceContainerId(activeContainer.id);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      if (!activeContainer || !overContainer) return;
      if (sourceContainerId !== overContainer.id) {
        setOverContainerId(overContainer.id);
      } else {
        setOverContainerId(null);
      }
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );

      // const activeitemIndex = activeContainer.items.findIndex(
      //   (item) => item.id === active.id,
      // );
      // const overitemIndex = overContainer.items.findIndex(
      //   (item) => item.id === over.id,
      // );
      // same container
      if (activeContainerIndex === overContainerIndex) {
        // const newItems = [...containers];
        // if (!newItems[activeContainerIndex]) return;
        // newItems[activeContainerIndex].items = arrayMove(
        //   newItems[activeContainerIndex].items,
        //   activeitemIndex,
        //   overitemIndex,
        // );
        // setContainers(newItems);
      } else {
        // diff containers
        // const newItems = [...containers];
        // if (!newItems[activeContainerIndex]) return;
        // if (!newItems[overContainerIndex]) return;
        // const [removedItem] = newItems[activeContainerIndex].items.splice(
        //   activeitemIndex,
        //   1,
        // );
        // if (!removedItem) return;
        // newItems[overContainerIndex].items.splice(
        //   overitemIndex,
        //   0,
        //   removedItem,
        // );
        // setContainers(newItems);
      }
    }

    // drag into droppable
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      if (!activeContainer || !overContainer) return;

      // const activeContainerIndex = containers.findIndex(
      //   (container) => container.id === activeContainer.id,
      // );
      // const overContainerIndex = containers.findIndex(
      //   (container) => container.id === overContainer.id,
      // );

      // const activeitemIndex = activeContainer.items.findIndex(
      //   (item) => item.id === active.id,
      // );

      if (sourceContainerId !== overContainer.id) {
        setOverContainerId(over.id);
      } else {
        setOverContainerId(null);
      }
      // const newItems = [...containers];

      // if (!newItems[activeContainerIndex]) return;
      // if (!newItems[overContainerIndex]) return;
      // const [removedItem] = newItems[activeContainerIndex].items.splice(
      //   activeitemIndex,
      //   1,
      // );
      // if (!removedItem) return;
      // newItems[overContainerIndex].items.push(removedItem);
      // setContainers(newItems);
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setOverContainerId(null);
    if (
      active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === active.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === over.id,
      );
      let newItems = [...containers];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setContainers(newItems);
    }

    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      if (!activeContainer || !overContainer) return;
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      );

      // in same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers];
        if (!newItems[activeContainerIndex]) return;
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex,
        );
        setContainers(newItems);
      } else {
        // in diff containers
        const newItems = [...containers];
        if (!newItems[activeContainerIndex]) return;
        if (!newItems[overContainerIndex]) return;

        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1,
        );
        if (!removeditem) return;
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem,
        );
        setContainers(newItems);
      }
    }
    // drop item in container
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      if (!activeContainer || !overContainer) return;
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );

      const newItems = [...containers];
      if (!newItems[activeContainerIndex]) return;
      if (!newItems[overContainerIndex]) return;

      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1,
      );

      if (!removeditem) return;

      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
    setActiveId(null);
  }

  return (
    <div className="flex h-full w-full shrink-0 flex-col">
      {/* <Dialog>
        <DialogTrigger>
          <Button variant="outline">
            <PlusIcon className="mr-2 h-5 w-5" /> New List
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a task list</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <Input
            id="list-name"
            type="text"
            placeholder="New Task List Title"
            name="containername"
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
          />
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="submit" onClick={onAddContainer}>
                <span className="sr-only">Create new task list</span>
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      <div className="mb-0.5 flex justify-between">
        <Button variant="ghost" size="sm" className="h-6 px-2">
          <ListFilterIcon className="mr-1 h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm" className="h-6 px-2">
          <SlidersHorizontalIcon className="mr-1 h-4 w-4" />
          Display
        </Button>
      </div>
      <Dialog open={showAddItemModal} onOpenChange={setShowAddItemModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a task list</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <Input
            id="item-name"
            type="text"
            placeholder="New Item Name"
            name="itemname"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="submit" onClick={onAddItem}>
                <span className="sr-only">Create new task list</span>
                Create
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* h-full p-2 flex overflow-x-auto gap-2 touch-pan-x scroll-auto */}
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        // modifiers={[restrictToHorizontalAxis]}
      >
        <SortableContext
          items={containers.map((container) => container.id)}
          // strategy={horizontalListSortingStrategy}
        >
          <ScrollArea className="h-full w-[calc(100vw-2rem)] scroll-smooth sm:w-[calc(100vw-7.5rem)] [&>*]:[&>*]:h-full">
            <div className="flex h-full w-full shrink-0 gap-2 py-2">
              {containers.map((container) => (
                <Container
                  key={container.id}
                  id={container.id}
                  status={container.status}
                  title={container.title}
                  isOverlayVisible={overContainerId === container.id}
                  onAddItem={() => {
                    setShowAddItemModal(true);
                    setCurrentContainerId(container.id);
                  }}
                >
                  {/* {container.items.length > 0 && ( */}
                  <SortableContext
                    items={container.items.map((i) => i.id)}
                    // strategy={verticalListSortingStrategy}
                  >
                    <ScrollArea className="h-[calc(100vh-12rem)] pr-3">
                      <div className="flex h-full flex-col items-start gap-y-4">
                        {container.items.map((i) => (
                          <Items
                            title={i.title}
                            id={i.id}
                            key={i.id}
                            status={container.status.value}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </SortableContext>
                  {/* )} */}
                </Container>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </SortableContext>
        <DragOverlay adjustScale={false}>
          {activeId && activeId.toString().includes("item") && (
            <Items
              id={activeId}
              title={findItemTitle(activeId)}
              status={findItemStatus(activeId).value}
            />
          )}
          {activeId && activeId.toString().includes("container") && (
            <Container
              id={activeId}
              title={findContainerTitle(activeId)}
              isOverlay
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// {findContainerItems(activeId).map((i) => (
//   <Items key={i.id} title={i.title} id={i.id} />
// ))}
