const DIRECTIONS = [
  {
    id: "health",
    title: "Здоровье и энергия",
    subtitle: "Свобода передвижения, общения, информации",
  },
  {
    id: "family",
    title: "Семья и отношения",
  },
  {
    id: "friends",
    title: "Друзья | Окружение | Нетворкинг",
  },
  {
    id: "mindset",
    title: "Образ мышления и стиль жизни",
  },
  {
    id: "growth",
    title: "Личностный рост | Образование",
  },
  {
    id: "career",
    title: "Карьера | Бизнес | Проекты",
  },
  {
    id: "finance",
    title: "Финансы (активы и пассивы)",
  },
  {
    id: "travel",
    title: "Путешествия и яркость жизни",
  },
  {
    id: "hobby",
    title: "Хобби и увлечения",
  },
  {
    id: "social",
    title: "Социальная ответственность",
  },
];

const STATUS_LABELS = {
  backlog: "Запланировано",
  in_progress: "В работе",
  done: "Готово",
};

const STORAGE_KEY = "life-kanban";

const board = document.querySelector("#board");
const dialog = document.querySelector("#card-dialog");
const form = document.querySelector("#card-form");
const resetButton = document.querySelector("#reset-board");
const cancelButton = document.querySelector("#cancel-dialog");

const defaultState = {
  cards: {},
};

const state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return structuredClone(defaultState);
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      cards: parsed.cards ?? {},
    };
  } catch (error) {
    console.warn("Не удалось прочитать локальные данные", error);
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCardsByDirection(directionId) {
  return Object.values(state.cards).filter((card) => card.directionId === directionId);
}

function renderBoard() {
  board.innerHTML = "";

  DIRECTIONS.forEach((direction) => {
    const section = document.createElement("section");
    section.className = "direction";

    const header = document.createElement("header");
    const title = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.textContent = direction.title;
    title.appendChild(h2);

    if (direction.subtitle) {
      const subtitle = document.createElement("small");
      subtitle.textContent = direction.subtitle;
      title.appendChild(subtitle);
    }

    const addButton = document.createElement("button");
    addButton.className = "primary";
    addButton.textContent = "Добавить";
    addButton.addEventListener("click", () => openDialog(direction.id));

    header.appendChild(title);
    header.appendChild(addButton);

    const columns = document.createElement("div");
    columns.className = "columns";

    ["backlog", "in_progress", "done"].forEach((status) => {
      const column = document.createElement("div");
      column.className = "column";

      const columnHeader = document.createElement("div");
      columnHeader.className = "column-header";
      columnHeader.textContent = STATUS_LABELS[status];

      column.appendChild(columnHeader);

      const cards = getCardsByDirection(direction.id).filter((card) => card.status === status);
      if (cards.length === 0) {
        const empty = document.createElement("small");
        empty.textContent = "Нет задач";
        empty.className = "empty";
        column.appendChild(empty);
      }

      cards.forEach((card) => {
        column.appendChild(renderCard(card));
      });

      columns.appendChild(column);
    });

    section.appendChild(header);
    section.appendChild(columns);
    board.appendChild(section);
  });
}

function renderCard(card) {
  const container = document.createElement("article");
  container.className = "card";

  const title = document.createElement("h3");
  title.textContent = card.title;
  container.appendChild(title);

  if (card.description) {
    const description = document.createElement("p");
    description.textContent = card.description;
    container.appendChild(description);
  }

  const footer = document.createElement("footer");
  const select = document.createElement("select");

  Object.entries(STATUS_LABELS).forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    if (value === card.status) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  select.addEventListener("change", (event) => {
    updateCard(card.id, { status: event.target.value });
  });

  const removeButton = document.createElement("button");
  removeButton.className = "ghost";
  removeButton.textContent = "Удалить";
  removeButton.addEventListener("click", () => {
    deleteCard(card.id);
  });

  footer.appendChild(select);
  footer.appendChild(removeButton);
  container.appendChild(footer);

  return container;
}

function openDialog(directionId) {
  form.reset();
  form.directionId.value = directionId;
  form.status.value = "backlog";
  dialog.showModal();
}

function closeDialog() {
  dialog.close();
}

function addCard({ directionId, title, description, status }) {
  const id = crypto.randomUUID();
  state.cards[id] = {
    id,
    directionId,
    title,
    description,
    status,
    createdAt: new Date().toISOString(),
  };
  saveState();
  renderBoard();
}

function updateCard(id, updates) {
  if (!state.cards[id]) return;
  state.cards[id] = {
    ...state.cards[id],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveState();
  renderBoard();
}

function deleteCard(id) {
  delete state.cards[id];
  saveState();
  renderBoard();
}

function resetBoard() {
  state.cards = {};
  saveState();
  renderBoard();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  addCard({
    directionId: data.get("directionId"),
    title: data.get("title"),
    description: data.get("description"),
    status: data.get("status"),
  });
  closeDialog();
});

cancelButton.addEventListener("click", () => {
  closeDialog();
});

resetButton.addEventListener("click", () => {
  if (confirm("Сбросить все задачи?")) {
    resetBoard();
  }
});

renderBoard();
