(function () {
  const rangeMap = {
    10: "80–87",
    11: "88–95",
    12: "96–103",
    13: "104–111",
    14: "112–119",
    15: "120–127",
    16: "128–135",
  };

  const boundsMap = {
    10: [80, 87],
    11: [88, 95],
    12: [96, 103],
    13: [104, 111],
    14: [112, 119],
    15: [120, 127],
    16: [128, 135],
  };

  function processTable(table) {
    const header = table.querySelector("thead tr");
    if (!header) return;

    const th1 = document.createElement("th");
    th1.textContent = "eSI";
    header.appendChild(th1);

    const th2 = document.createElement("th");
    th2.textContent = "potSI";
    header.appendChild(th2);

    const rows = table.querySelectorAll("tbody tr, tr:not(:first-child)");
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (!cells.length) return;

      const potCell = cells[cells.length - 2];
      const siCell = cells[cells.length - 3];

      const pot = parseInt(potCell.textContent.trim(), 10);
      const si = parseInt(siCell.textContent.trim(), 10);

      const esiRange = rangeMap[pot] || "";
      const bounds = boundsMap[pot] || null;

      const td1 = document.createElement("td");
      td1.textContent = esiRange;
      row.appendChild(td1);

      const td2 = document.createElement("td");
      if (bounds && !isNaN(si)) {
        let minDev = bounds[0] - si;
        let maxDev = bounds[1] - si;
        if (minDev < 0) minDev = 0;
        if (maxDev < 0) maxDev = 0;

        td2.textContent =
          minDev === 0 && maxDev === 0 ? "0" : `${minDev}–${maxDev}`;
      } else {
        td2.textContent = "";
      }
      row.appendChild(td2);
    });
  }

  function run() {
    const players = document.querySelector("#players");
    if (players) processTable(players);

    const pitchers = document.querySelector("#pitchers");
    if (pitchers) processTable(pitchers);
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    run();
  } else {
    document.addEventListener("DOMContentLoaded", run);
  }
})();
