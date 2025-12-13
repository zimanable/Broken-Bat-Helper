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
    "Bat Control": [{ regex: /.*/, max: 20 }],
    "Plate Discipline": [{ regex: /.*/, max: 20 }],
    Power: [
      { regex: /prolific slugger/i, max: 20 },
      { regex: /decent slugger/i, max: 17 },
      { regex: /above average slugger/i, max: 14 },
      { regex: /.*/, max: 11 },
    ],
    Speed: [
      { regex: /really quick/i, max: 20 },
      { regex: /decent speed/i, max: 17 },
      { regex: /not very fast/i, max: 7 },
      { regex: /.*/, max: 13 },
    ],
    Fielding: [
      { regex: /amazing in the field/i, max: 20 },
      { regex: /outstanding in the field/i, max: 17 },
      { regex: /solid in the field/i, max: 15 },
      { regex: /below average fielder/i, max: 9 },
      { regex: /poor fielder/i, max: 7 },
      { regex: /atrocious fielder/i, max: 6 },
      { regex: /.*/, max: 12 },
    ],
    Range: [{ regex: /.*/, max: 20 }],
    Arm: [{ regex: /.*/, max: 20 }],
    // Pitchers
    Velocity: [
      { regex: /unhittable/i, max: 20 },
      { regex: /strike out pitcher/i, max: 18 },
      { regex: /major league fastball/i, max: 16 },
      { regex: /have some pop/i, max: 14 },
      { regex: /.*/, max: 12 },
    ],
    "Change of Speeds": [{ regex: /.*/, max: 20 }],
    Movement: [
      { regex: /exceptional/i, max: 20 },
      { regex: /major league slider/i, max: 17 },
      { regex: /major league curveball/i, max: 17 },
      { regex: /.*/, max: 14 },
    ],
    Control: [
      { regex: /control will always be below average/i, max: 10 },
      { regex: /lacking/i, max: 8 },
      { regex: /wild/i, max: 6 },
      { regex: /.*/, max: 20 },
    ],
    Stamina: [
      { regex: /throw all day/i, max: 20 },
      { regex: /starting pitcher/i, max: 17 },
      { regex: /few innings/i, max: 8 },
      { regex: /.*/, max: 14 },
    ],
  };

  function getMaxStat(reportText, stat) {
    const rules = statConfigs[stat];
    if (!rules) return null;
    for (const r of rules) {
      if (r.regex.test(reportText)) return r.max;
    }
    return null;
  }

  function drawStatBar(currentStat, maxStat = null) {
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

    return canvas;
  }

  function createStatControl(stat, initialValue, maxValue, onChange) {
    let current = initialValue;

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.marginBottom = "4px";

    const label = document.createElement("span");
    label.style.width = "100px";
    // label.style.fontWeight = "bold";
    label.textContent = stat + ":";
    label.style.marginRight = "6px";
    container.appendChild(label);

    const decBtn = document.createElement("button");
    decBtn.textContent = "-";
    decBtn.style.marginRight = "4px";
    decBtn.style.cursor = "pointer";
    decBtn.style.padding = "2px 6px";
    // decBtn.style.fontSize = "12px";
    decBtn.onclick = () => {
      if (current > initialValue) {
        current--;
        updateDisplay();
        onChange(current);
      }
    };
    container.appendChild(decBtn);

    const incBtn = document.createElement("button");
    incBtn.textContent = "+";
    incBtn.style.marginLeft = "8px";
    incBtn.style.cursor = "pointer";
    incBtn.style.padding = "2px 6px";
    // incBtn.style.fontSize = "12px";
    incBtn.onclick = () => {
      if (current < maxValue) {
        current++;
        updateDisplay();
        onChange(current);
      }
    };

    const barContainer = document.createElement("span");
    barContainer.style.display = "inline-block";
    barContainer.style.marginLeft = "8px";

    const numSpan = document.createElement("span");
    numSpan.style.marginLeft = "6px";
    // numSpan.style.fontSize = "12px";

    function updateDisplay() {
      barContainer.innerHTML = "";
      const bar = drawStatBar(current, maxValue);
      barContainer.appendChild(bar);
      numSpan.textContent = `${current} (max ${maxValue})`;
    }

    updateDisplay();

    container.appendChild(barContainer);
    container.appendChild(incBtn);
    container.appendChild(numSpan);

    return container;
  }

  function insertPlanningTool() {
    const playerCard = document.querySelector(".player-card");
    if (!playerCard) return;

    const reportRow = Array.from(playerCard.querySelectorAll("tr")).find((r) =>
      /Scouting Report:/i.test(r.textContent)
    );
    const reportText = reportRow ? reportRow.textContent : "";

    const isHitter = /Hitting/i.test(playerCard.textContent);

    const outerWrapper = document.createElement("div");
    outerWrapper.style.display = "flex";
    outerWrapper.style.justifyContent = "center";
    outerWrapper.style.marginTop = "12px";

    const container = document.createElement("div");
    container.style.textAlign = "center";
    container.style.marginTop = "12px";
    // container.style.padding = "10px";
    container.style.borderTop = "3px solid #AABCFE";
    container.style.borderBottom = "1px solid #ffffffff";
    container.style.backgroundColor = "#E8EDFF";
    container.style.display = "inline-block";
    // container.style.minWidth = "400px";
    container.style.color = "#666699";

    const title = document.createElement("div");
    title.textContent = "Planning Tool";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "8px";
    title.style.textAlign = "center";
    title.style.backgroundColor = "#b9c9fe";
    title.style.width = "100%";
    title.style.padding = "10px 0";
    title.style.color = "#003399";
    title.style.borderBottom = "1px solid #ffffffff";
    container.appendChild(title);

    const statsList = document.createElement("div");
    statsList.style.textAlign = "right";
    statsList.style.padding = "6px 6px 12px 12px";

    const rows = playerCard.querySelectorAll("tr");
    const tdMap = {};
    rows.forEach((tr) => {
      const tds = tr.querySelectorAll("td");
      if (tds.length >= 5) {
        const left = tds[1]?.textContent.trim().replace(":", "");
        const right = tds[2]?.textContent.trim().match(/\d+/)?.[0];
        if (left && right) tdMap[left] = parseInt(right);
        const left2 = tds[3]?.textContent.trim().replace(":", "");
        const right2 = tds[4]?.textContent.trim().match(/\d+/)?.[0];
        if (left2 && right2) tdMap[left2] = parseInt(right2);
      }
    });

    const hitterOrder = [
      "Hitting",
      "Bat Control",
      "Plate Discipline",
      "Power",
      "Speed",
      "",
      "Fielding",
      "Range",
      "Arm",
      "",
      "Skill Index",
      "Potential",
    ];
    const pitcherOrder = [
      "Velocity",
      "Change of Speeds",
      "Movement",
      "Control",
      "Stamina",
      "",
      "Fielding",
      "Range",
      "Arm",
      "",
      "Skill Index",
      "Potential",
    ];
    const order = isHitter ? hitterOrder : pitcherOrder;

    const currentValues = {};
    const skillIndexLine = document.createElement("div");
    // skillIndexLine.style.fontWeight = "bold";
    skillIndexLine.style.marginTop = "4px";

    function updateSkillIndex() {
      let si = 0;
      if (isHitter) {
        si =
          1.0 *
            ((currentValues["Hitting"] || 0) +
              (currentValues["Plate Discipline"] || 0) +
              (currentValues["Bat Control"] || 0) +
              (currentValues["Power"] || 0) +
              (currentValues["Speed"] || 0)) +
          1.0 *
            ((currentValues["Fielding"] || 0) +
              (currentValues["Range"] || 0) +
              (currentValues["Arm"] || 0));
      } else {
        si =
          1.25 *
            ((currentValues["Velocity"] || 0) +
              (currentValues["Change of Speeds"] || 0) +
              (currentValues["Movement"] || 0) +
              (currentValues["Control"] || 0) +
              (currentValues["Stamina"] || 0)) +
          0.5 *
            ((currentValues["Fielding"] || 0) +
              (currentValues["Range"] || 0) +
              (currentValues["Arm"] || 0));
      }
      skillIndexLine.textContent = "Skill Index: " + si.toFixed(1);
    }

    order.forEach((stat) => {
      if (stat === "") {
        statsList.appendChild(document.createElement("br"));
      } else if (stat === "Skill Index") {
        statsList.appendChild(skillIndexLine);
      } else if (stat === "Potential") {
        const line = document.createElement("div");
        // line.style.fontWeight = "bold";
        line.textContent = `${stat}: ${tdMap[stat] || ""}`;
        statsList.appendChild(line);
      } else {
        const initialValue = tdMap[stat] || 0;
        const maxValue = getMaxStat(reportText, stat) || initialValue;
        currentValues[stat] = initialValue;
        const statControl = createStatControl(
          stat,
          initialValue,
          maxValue,
          (newVal) => {
            currentValues[stat] = newVal;
            updateSkillIndex();
          }
        );
        statsList.appendChild(statControl);
      }
    });

    updateSkillIndex();
    container.appendChild(statsList);
    playerCard.parentNode.insertBefore(container, playerCard.nextSibling);

    outerWrapper.appendChild(container);
    playerCard.parentNode.insertBefore(outerWrapper, playerCard.nextSibling);
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    insertPlanningTool();
  } else {
    document.addEventListener("DOMContentLoaded", insertPlanningTool);
  }
})();
