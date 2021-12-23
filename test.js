import Entity from "./nqtx";

const entity = new Entity();

entity.particle({
  id: "todos",
  initialValue: [],
  mutator: ({ set, state, mutation, todo, todoId }) => {
    switch (mutation) {
      case "delete":
    }
  },
});

entity.derivative({});

entity.trigger({});
