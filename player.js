(function () {
  const statConfigs = {
    // Hitters
    Hitting: [
      { regex: /great hitter/i, max: 20 },
      { regex: /very good hitter/i, max: 17 },
      { regex: /good hitter/i, max: 15 },
      { regex: /never be a decent hitter/i, max: 7 },
      { regex: /.*/, max: 13 },
    ],
    Power: [
      { regex: /prolific slugger/i, max: 20 },
      { regex: /decent slugger/i, max: 17 },
      { regex: /above average slugger/i, max: 14 },
      { regex: /.*/, max: 11 },
    ],
    Fielding: [
      { regex: /amazing in the field/i, max: 20 },
      { regex: /outstanding in the field/i, max: 17 },
      { regex: /solid in the field/i, max: 15 },
      { regex: /nothing/i, max: 12 },
      { regex: /below average fielder/i, max: 9 },
      { regex: /poor fielder/i, max: 7 },
      { regex: /atrocious fielder/i, max: 6 },
      { regex: /.*/, max: 12 },
    ],
    Speed: [
      { regex: /really quick/i, max: 20 },
      { regex: /decent speed/i, max: 17 },
      { regex: /.*/, max: 13 },
      { regex: /not very fast/i, max: 7 },
    ],
    // Pitchers
    Velocity: [
      { regex: /unhittable/i, max: 20 },
      { regex: /strike out pitcher/i, max: 18 },
      { regex: /major league fastball/i, max: 16 },
      { regex: /have some pop/i, max: 14 },
      { regex: /.*/, max: 12 },
    ],
    Movement: [
      { regex: /exceptional/i, max: 20 },
      { regex: /major league/i, max: 17 },
      { regex: /.*/, max: 14 },
    ],
    Stamina: [
      { regex: /throw all day/i, max: 20 },
      { regex: /starting pitcher/i, max: 17 },
      { regex: /.*/, max: 14 },
      { regex: /few innings/i, max: 8 },
    ],
    Control: [
      { regex: /control will always be below average/i, max: 10 },
      { regex: /lacking/i, max: 8 },
      { regex: /wild/i, max: 6 },
      { regex: /.*/, max: 20 },
    ],
  };

  const statColumnIndex = {
    Hitting: 2,
    Power: 2,
    Fielding: 4,
    Speed: 2,
    Velocity: 2,
    Movement: 2,
    Stamina: 2,
    Control: 2,
    "Bat Control": 2,
    "Plate Discipline": 2,
    Range: 4,
    Arm: 4,
  };

  const potToESI = {
    10: "80–87",
    11: "88–95",
    12: "96–103",
    13: "104–111",
    14: "112–119",
    15: "120–127",
    16: "128–135",
  };

  function getMaxStatFromReport(reportText, stat) {
    const rules = statConfigs[stat];
    if (!rules) return null;
    for (const r of rules) {
      if (r.regex.test(reportText)) return r.max;
    }
    return null;
  }

  function drawStatBar(cell, currentStat, maxStat = null) {
    cell.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.width = 123;
    canvas.height = 9;
    const ctx = canvas.getContext("2d");

    const totalSquares = 20;
    const outerPadding = 2;
    const gap = 1;
    const squareWidth =
      (canvas.width - outerPadding * 2 - gap * (totalSquares - 1)) /
      totalSquares;
    const squareHeight = canvas.height - outerPadding * 2;

    ctx.strokeStyle = "#0000bd";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);

    for (let i = 0; i < totalSquares; i++) {
      const x = outerPadding + i * (squareWidth + gap);
      const y = outerPadding;
      if (i < currentStat) {
        const t = i / (totalSquares - 1);
        let r = 0,
          g = 0,
          b = 0;
        if (t <= 0.5) {
          const factor = t / 0.5;
          r = factor * 0x6b;
          g = 0;
          b = 0xbc + factor * (0x6a - 0xbc);
        } else {
          const factor = (t - 0.5) / 0.5;
          r = 0x6b + factor * (0xd7 - 0x6b);
          g = 0;
          b = 0x6a + factor * (0x18 - 0x6a);
        }
        ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(
          b
        )})`;
      } else if (maxStat !== null && i < maxStat) {
        ctx.fillStyle = "#50be00";
      } else continue;
      ctx.fillRect(x, y, squareWidth, squareHeight);
    }

    cell.prepend(canvas);
    canvas.style.marginRight = "5px";

    const numberSpan = document.createElement("span");
    numberSpan.style.marginLeft = "2px";
    numberSpan.textContent =
      maxStat !== null ? `${currentStat} (${maxStat})` : `${currentStat}`;
    cell.appendChild(numberSpan);
  }

  function annotateStats() {
    const table = document.querySelector(".player-card tbody");
    if (!table) return;

    const rows = table.querySelectorAll("tr");
    const scoutingText =
      Array.from(rows)
        .find((r) => /Scouting Report:/i.test(r.textContent))
        ?.textContent.toLowerCase() || "";

    Object.keys(statColumnIndex).forEach((stat) => {
      const row = Array.from(rows).find((r) =>
        new RegExp(stat + ":", "i").test(r.textContent)
      );
      if (!row) return;

      const cell = row.querySelectorAll("td")[statColumnIndex[stat]];
      if (!cell) return;

      const currentStat = parseInt(
        cell.textContent.match(/\d+/)?.[0] || "0",
        10
      );
      const maxStat = getMaxStatFromReport(scoutingText, stat);

      drawStatBar(cell, currentStat, maxStat);
    });
  }

  function annotatePotential() {
    const table = document.querySelector(".player-card tbody");
    if (!table) return;

    const potentialRow = Array.from(table.querySelectorAll("tr")).find(
      (tr) =>
        tr.querySelectorAll("td")[3] &&
        /Potential:/i.test(tr.querySelectorAll("td")[3].textContent)
    );
    if (!potentialRow) return;

    const potCell = potentialRow.querySelectorAll("td")[4];
    if (!potCell) return;

    const potNum = parseInt(potCell.textContent.match(/\d+/)?.[0], 10);
    const potentialESI = potToESI[potNum];
    if (!potentialESI) return;

    const children = Array.from(potCell.childNodes);
    potCell.textContent = "";
    children.forEach((c) => potCell.appendChild(c));

    const span = document.createElement("span");
    span.textContent = ` (${potentialESI})`;
    potCell.appendChild(span);
  }

  function init() {
    annotateStats();
    annotatePotential();
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
