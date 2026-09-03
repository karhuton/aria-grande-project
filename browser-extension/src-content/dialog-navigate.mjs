import {
  closeActionsDialog,
  getExploreButtons,
  getExploreDialog,
  getExploreStatus,
  getExploreTitle,
  openActionsDialog,
  updateStatus
} from "./dialog.mjs";

let navigateChildListSequence = 0;

export function showExplorePages(pages, siteName) {
  const title = getExploreTitle();
  const status = getExploreStatus();
  const buttons = getExploreButtons();
  title.textContent = `${siteName} main pages`;
  status.textContent = "Choose a page.";
  buttons.replaceChildren();

  const list = document.createElement("ul");
  list.className = "navigate-list";
  for (const page of pages) list.append(createExploreListItem(page));
  buttons.append(list);

  const returnButton = document.createElement("button");
  returnButton.type = "button";
  returnButton.className = "reverse";
  returnButton.textContent = "Return to actions";
  returnButton.addEventListener("click", returnToActions);
  buttons.append(returnButton);

  closeActionsDialog();
  getExploreDialog().showModal();
  buttons.querySelector("button").focus();
}

function createExploreListItem(page) {
  const item = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";

  if (page.children.length === 0) {
    button.textContent = page.label;
    button.addEventListener("click", () => openExplorePage(page));
    item.append(button);
    return item;
  }

  const childList = document.createElement("ul");
  const childListId = createExploreChildListId();
  childList.id = childListId;
  childList.className = "navigate-children";
  childList.hidden = true;

  button.textContent = `${page.label} (${page.children.length})`;
  button.setAttribute(
    "aria-label",
    `${page.label} – ${page.children.length} links`
  );
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", childListId);
  button.addEventListener("click", () =>
    toggleExploreChildren(button, childList)
  );

  for (const child of page.children) {
    childList.append(createExploreListItem(child));
  }

  item.append(button, childList);
  return item;
}

function toggleExploreChildren(button, childList) {
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  childList.hidden = expanded;

  if (!expanded) {
    childList.querySelector("button").focus();
  }
}

function createExploreChildListId() {
  navigateChildListSequence += 1;
  return `aria-grande-navigate-children-${navigateChildListSequence}`;
}

function openExplorePage(page) {
  getExploreStatus().textContent = `Opening ${page.label}…`;
  getExploreDialog().close();
  location.assign(page.url);
}

export function returnToActions() {
  getExploreDialog().close();
  updateStatus("Choose an action.");
  openActionsDialog();
}

