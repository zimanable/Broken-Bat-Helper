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
    const availableWidth =
      canvas.width - outerPadding * 2 - gap * (totalSquares - 1);
    const squareWidth = availableWidth / totalSquares;
    const squareHeight = canvas.height - outerPadding * 2;

    const radius = 1;
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(radius + 0.5, 0.5);
    ctx.lineTo(canvas.width - radius - 0.5, 0.5);
    ctx.quadraticCurveTo(
      canvas.width - 0.5,
      0.5,
      canvas.width - 0.5,
      radius + 0.5
    );
    ctx.lineTo(canvas.width - 0.5, canvas.height - radius - 0.5);
    ctx.quadraticCurveTo(
      canvas.width - 0.5,
      canvas.height - 0.5,
      canvas.width - radius - 0.5,
      canvas.height - 0.5
    );
    ctx.lineTo(radius + 0.5, canvas.height - 0.5);
    ctx.quadraticCurveTo(
      0.5,
      canvas.height - 0.5,
      0.5,
      canvas.height - radius - 0.5
    );
    ctx.lineTo(0.5, radius + 0.5);
    ctx.quadraticCurveTo(0.5, 0.5, radius + 0.5, 0.5);
    ctx.closePath();
    ctx.stroke();

    for (let i = 0; i < totalSquares; i++) {
      const x = outerPadding + i * (squareWidth + gap);
      const y = outerPadding;
      if (i < currentStat) {
        const t = i / (totalSquares - 1);
        let r, g, b;
        if (t <= 0.5) {
          const factor = t / 0.5;
          r = 0 + factor * (0x6b - 0x00);
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
        ctx.fillStyle = "#2ecc71";
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
    const scoutingCell = Array.from(rows).find((r) =>
      /Scouting Report:/i.test(r.textContent)
    );
    const reportText = scoutingCell
      ? scoutingCell.textContent.toLowerCase()
      : "";

    Object.keys(statColumnIndex).forEach((stat) => {
      let row;
      for (const r of rows) {
        if (new RegExp(stat + ":", "i").test(r.textContent)) {
          row = r;
          break;
        }
      }
      if (!row) return;

      const idx = statColumnIndex[stat];
      const cell = row.querySelectorAll("td")[idx];
      if (!cell) return;

      const statText = cell.textContent.trim().match(/\d+/);
      const currentStat = statText ? parseInt(statText[0], 10) : 0;
      const maxStat = getMaxStatFromReport(reportText, stat);

      drawStatBar(cell, currentStat, maxStat);
    });
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    annotateStats();
  } else {
    document.addEventListener("DOMContentLoaded", annotateStats);
  }
})();
