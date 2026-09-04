(() => {
  const storageKey = "aria-grande-introduction-shown";

  try {
    if (localStorage.getItem(storageKey)) {
      return;
    }

    localStorage.setItem(storageKey, "true");
  } catch {
    // If local storage is unavailable, still show the introduction.
  }

  window.BLOCK_ARIA_GRANDE = true;

  const dialog = document.createElement("dialog");
  dialog.className = "aria-grande-introduction";
  dialog.setAttribute("aria-labelledby", "aria-grande-introduction-title");
  dialog.innerHTML = `
    <h1 id="aria-grande-introduction-title">Aria Grande live test site</h1>
    <p>This is a fictious, static information government website, where the user's task is to try to find information.</p>
    <p><strong>The site has the Aria Grande browser extension embedded into it</strong>, so you don't need to install it.</p>
    <hr>
    <p>The Aria Grande extension is developed for people with low sight or blindness, who normally use a screen reader.</p>
    <p>After closing this dialog, on every page load the AG extension will popup an action UI.</p>
    <form method="dialog">
      <button type="submit">Close introduction</button>
    </form>
  `;

  const style = document.createElement("style");
  style.textContent = `
    .aria-grande-introduction {
      width: min(90vw, 70rem);
      max-height: min(85vh, 52rem);
      padding: clamp(1.5rem, 4vw, 4rem);
      border: 0;
      color: #172b3a;
      background: #ffffff;
      box-shadow: 0 1rem 3rem rgb(0 0 0 / 35%);
    }

    .aria-grande-introduction::backdrop {
      background: rgb(0 0 0 / 60%);
    }

    .aria-grande-introduction h1 {
      margin-top: 0;
      font-size: clamp(2rem, 5vw, 4rem);
    }

    .aria-grande-introduction p {
      max-width: 52rem;
      margin: 1.5rem 0;
      font-size: clamp(1.125rem, 2vw, 1.5rem);
    }

    .aria-grande-introduction hr {
      margin: 2rem 0;
      border: 0;
      border-top: 0.125rem solid #66808e;
    }

    .aria-grande-introduction form {
      display: flex;
      justify-content: end;
      margin-top: 2rem;
    }

    .aria-grande-introduction button {
      min-height: 3.5rem;
      padding: 0.75rem 1.5rem;
      border: 0.2rem solid #172b3a;
      color: #ffffff;
      background: #175c90;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .aria-grande-introduction button:focus {
      outline: 0.25rem solid #ffdc6a;
      outline-offset: 0.2rem;
    }
  `;

  document.head.append(style);
  document.body.append(dialog);
  dialog.addEventListener("close", () => {
    delete window.BLOCK_ARIA_GRANDE;
  });
  dialog.showModal();
})();
