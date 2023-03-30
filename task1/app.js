//Define Variables
let stop_Flag_Array = [false, false];
let Show_Flag_Array = [true, true];
let Rewind_Flag_Array = [false, false];
let Currant_Size_of_Graphing = [0, 0];
let Current_Color_Array = ["#151a27", "#151a27"];
let speed = Array.from(document.getElementsByClassName("speed"));
let File_Data_X = [[], []];
let File_Data_y = [[], []];
let Currant_Data_Graphing_Array_x = [[], []];
let Currant_Data_Graphing_Array_y = [[], []];
let label_input = ["", ""];
let Xlabel_input = ["", ""];
let Ylabel_input = ["", ""];
let rangeX = [
  [0, 2],
  [0, 2],
];
let Deration = [0, 0];
let Link_Flag = false;
var plots = [
  document.getElementById(`myDiv${0}`),
  document.getElementById(`myDiv${1}`),
];
let divs = [
  document.getElementById(`myDiv${0}`),
  document.getElementById(`myDiv${1}`),
];
let scroll_flag = ["", ""];
let stop_lopping_flag = true;
let tables = Array.from(document.getElementsByTagName("table"));
var pdf = new jsPDF({
  margin: 0,
});
function readCSVFile(id, Graph_num) {
  var files = document.querySelector(`#${id}`).files;

  if (files.length > 0) {
    // Selected file
    var file = files[0];

    // FileReader Object
    var reader = new FileReader();

    // Read file as string
    reader.readAsText(file);

    // Load event
    reader.onload = function (event) {
      // Read file data
      var csvdata = event.target.result;

      // Split by line break to gets rows Array

      var rowData = csvdata.split("\n");
      File_Data_X[Graph_num] = [];
      File_Data_y[Graph_num] = [];
      Array.from(rowData).forEach((row) => {
        rowXY = row.split(",");
        File_Data_X[Graph_num].push(parseFloat(rowXY[0]));
        File_Data_y[Graph_num].push(parseFloat(rowXY[1]));
      });
      Currant_Size_of_Graphing[Graph_num] = 0;
      let trace1 = {
        x: [0],
        y: [0],
        type: "scatter",
      };
      if (document.getElementById(`myDiv${Graph_num}`).childElementCount > 0) {
        Plotly.deleteTraces(`myDiv${Graph_num}`, [0]);
        Currant_Data_Graphing_Array_x[Graph_num] = [];
        Currant_Data_Graphing_Array_y[Graph_num] = [];
        Currant_Size_of_Graphing[Graph_num] = 0;
        Deration[Graph_num] = 0;
        rangeX[Graph_num] = [0, 2];
      } else Plotly.newPlot(`myDiv${Graph_num}`, [trace1]);

      setInterval(() => graphing(), 200);
    };
  } else {
    alert("Please select a file.");
  }
}
function stopGraphing(Graph_num) {
  stop_Flag_Array[Graph_num] = true;
  if (Link_Flag) stop_Flag_Array[Graph_num ^ 1] = true;
}
function continueGraphing(Graph_num) {
  stop_Flag_Array[Graph_num] = false;
  if (Link_Flag) stop_Flag_Array[Graph_num ^ 1] = false;
}
function changecolor(Graph_num) {
  Current_Color_Array[Graph_num] =
    document.getElementsByClassName("col")[Graph_num].value;
  if (Link_Flag)
    Current_Color_Array[Graph_num ^ 1] =
      document.getElementsByClassName("col")[Graph_num].value;
}
function graphing() {
  UpdateGraph(0);
  if (!Link_Flag) UpdateGraph(1);
}
function UpdateGraph(Graph_num) {
  if (
    Currant_Size_of_Graphing[Graph_num] < File_Data_X[Graph_num].length &&
    !stop_Flag_Array[Graph_num]
  ) {
    if (!Rewind_Flag_Array[Graph_num]) {
      let NewDataX = File_Data_X[Graph_num].slice(
        Currant_Size_of_Graphing[Graph_num],
        Currant_Size_of_Graphing[Graph_num] + parseInt(speed[Graph_num].value)
      );
      let NewDataY = File_Data_y[Graph_num].slice(
        Currant_Size_of_Graphing[Graph_num],
        Currant_Size_of_Graphing[Graph_num] + parseInt(speed[Graph_num].value)
      );
      if (Link_Flag) {
        let NewDataX1 = File_Data_X[Graph_num ^ 1].slice(
          Currant_Size_of_Graphing[Graph_num ^ 1],
          Currant_Size_of_Graphing[Graph_num ^ 1] +
            parseInt(speed[Graph_num].value)
        );
        let NewDataY1 = File_Data_y[Graph_num ^ 1].slice(
          Currant_Size_of_Graphing[Graph_num ^ 1],
          Currant_Size_of_Graphing[Graph_num ^ 1] +
            parseInt(speed[Graph_num].value)
        );
        Currant_Data_Graphing_Array_x[Graph_num ^ 1] =
          Currant_Data_Graphing_Array_x[Graph_num ^ 1].concat(NewDataX1);
        Currant_Data_Graphing_Array_y[Graph_num ^ 1] =
          Currant_Data_Graphing_Array_y[Graph_num ^ 1].concat(NewDataY1);
        Currant_Size_of_Graphing[Graph_num ^ 1] += parseInt(
          speed[Graph_num].value
        );
        UpdateGraphOnSite(Graph_num ^ 1);
      }
      Currant_Data_Graphing_Array_x[Graph_num] =
        Currant_Data_Graphing_Array_x[Graph_num].concat(NewDataX);

      Currant_Data_Graphing_Array_y[Graph_num] =
        Currant_Data_Graphing_Array_y[Graph_num].concat(NewDataY);
      Currant_Size_of_Graphing[Graph_num] += parseInt(speed[Graph_num].value);
      UpdateGraphOnSite(Graph_num);
    } else {
      if (Currant_Size_of_Graphing[Graph_num] >= 10) {
        Currant_Data_Graphing_Array_x[Graph_num] =
          Currant_Data_Graphing_Array_x[Graph_num].splice(
            0,
            Currant_Data_Graphing_Array_x[Graph_num].length -
              parseInt(speed[Graph_num].value)
          );
        Currant_Data_Graphing_Array_y[Graph_num] =
          Currant_Data_Graphing_Array_y[Graph_num].splice(
            0,
            Currant_Data_Graphing_Array_y[Graph_num].length -
              parseInt(speed[Graph_num].value)
          );
        if (Link_Flag) {
          Currant_Data_Graphing_Array_x[Graph_num ^ 1] =
            Currant_Data_Graphing_Array_x[Graph_num ^ 1].splice(
              0,
              Currant_Data_Graphing_Array_x[Graph_num ^ 1].length -
                parseInt(speed[Graph_num].value)
            );
          Currant_Data_Graphing_Array_y[Graph_num ^ 1] =
            Currant_Data_Graphing_Array_y[Graph_num ^ 1].splice(
              0,
              Currant_Data_Graphing_Array_y[Graph_num ^ 1].length -
                parseInt(speed[Graph_num].value)
            );
          Currant_Size_of_Graphing[Graph_num ^ 1] -= parseInt(
            speed[Graph_num].value
          );
          if (!(File_Data_X[Graph_num ^ 1].length == 0))
            UpdateGraphOnSite(Graph_num ^ 1);
        }
        Currant_Size_of_Graphing[Graph_num] -= parseInt(speed[Graph_num].value);
        if (!(File_Data_X[Graph_num].length == 0)) UpdateGraphOnSite(Graph_num);
      }
    }
    Statistics(Graph_num);
  }
  if (
    (divs[0].childElementCount > 0 && divs[0].layout.dragmode == "pan") ||
    (divs[1].childElementCount > 0 && divs[1].layout.dragmode == "pan")
  ) {
    divs[0].on("plotly_relayout", function (ed) {
      relayout(ed, divs);
    });
    divs[1].on("plotly_relayout", function (ed) {
      relayout(ed, divs);
    });
  }
}
function UpdateGraphOnSite(Graph_num) {
  let layout = {
    title: {
      text: label_input[Graph_num],
      color: "#00000",
      font: {
        family: "Courier New, monospace",
        size: 24,
      },
      xref: "paper",
      x: 0.05,
    },
    xaxis: {
      title: {
        text: Xlabel_input[Graph_num],
        font: {
          family: "Courier New, monospace",
          size: 18,
          color: "#7f7f7f",
        },
      },
      range: rangeX[Graph_num],
      rangeslider:
        Link_Flag && (scroll_flag[0] != "" || scroll_flag[1] != "")
          ? {}
          : scroll_flag[Graph_num],
    },
    yaxis: {
      title: {
        text: Ylabel_input[Graph_num],
        font: {
          family: "Courier New, monospace",
          size: 18,
          color: "#7f7f7f",
        },
      },
    },
  };
  Deration[Graph_num]++;

  if (
    Currant_Data_Graphing_Array_x[Graph_num][
      parseInt(Currant_Data_Graphing_Array_x[Graph_num].length) - 1
    ] +
      0.1 >
      rangeX[Graph_num][1] &&
    !Rewind_Flag_Array[Graph_num]
  ) {
    rangeX[Graph_num] = [
      Currant_Data_Graphing_Array_x[Graph_num][
        parseInt(Currant_Data_Graphing_Array_x[Graph_num].length) - 100
      ],
      Currant_Data_Graphing_Array_x[Graph_num][
        parseInt(Currant_Data_Graphing_Array_x[Graph_num].length) - 2
      ] + 3,
    ];
  } else if (
    Rewind_Flag_Array[Graph_num] &&
    Currant_Data_Graphing_Array_x[Graph_num][
      parseInt(Currant_Data_Graphing_Array_x[Graph_num].length) - 1
    ] -
      0.1 <
      rangeX[Graph_num][0]
  ) {
    rangeX[Graph_num] = [
      Currant_Data_Graphing_Array_x[Graph_num][
        parseInt(Currant_Data_Graphing_Array_x[Graph_num].length) - 10
      ] - 3,
      Currant_Data_Graphing_Array_x[Graph_num][
        parseInt(Currant_Data_Graphing_Array_x[Graph_num].length) - 2
      ],
    ];
  }
  if (Link_Flag && stop_lopping_flag) {
    plots.forEach((div) => {
      div.on("plotly_relayout", function (ed) {
        relayout(ed, divs);
      });
    });
    stop_lopping_flag = false;
  } //call lel zoom , scroll relayout

  Plotly.react(
    `myDiv${Graph_num}`,
    [
      {
        x: Currant_Data_Graphing_Array_x[Graph_num],
        y: Currant_Data_Graphing_Array_y[Graph_num],
        type: "scatter",
        marker: {
          color: Current_Color_Array[Graph_num],
        }, //m4 t3ed al rsm btzwed 3la al rasma dah law data mt5znah
      },
    ],
    layout,
    { showSendToCloud: true }
  );
  Plotly.restyle(document.getElementById(`myDiv${Graph_num}`), {
    visible: Show_Flag_Array[Graph_num],
  });
}
function Show_Hide(Graph_num) {
  Show_Flag_Array[Graph_num] = !Show_Flag_Array[Graph_num];
  if (Link_Flag) Show_Flag_Array[Graph_num ^ 1] = Show_Flag_Array[Graph_num];
}
function Rewind(Graph_num) {
  Rewind_Flag_Array[Graph_num] = !Rewind_Flag_Array[Graph_num];
  if (Link_Flag)
    Rewind_Flag_Array[Graph_num ^ 1] = Rewind_Flag_Array[Graph_num];
}

function ChangeTitle(Graph_num) {
  label_input[Graph_num] =
    document.getElementsByClassName("Title")[Graph_num].value;
  if (Link_Flag) label_input[Graph_num ^ 1] = label_input[Graph_num];
}
function ChangeXaXIS(Graph_num) {
  Xlabel_input[Graph_num] =
    document.getElementsByClassName("XAxis")[Graph_num].value;
  if (Link_Flag) Xlabel_input[Graph_num ^ 1] = Xlabel_input[Graph_num];
}
function ChangeYaXIS(Graph_num) {
  Ylabel_input[Graph_num] =
    document.getElementsByClassName("YAxis")[Graph_num].value;
  if (Link_Flag) Ylabel_input[Graph_num ^ 1] = Ylabel_input[Graph_num];
}
function Statistics(Graph_num) {
  document.getElementById(`mean${Graph_num}`).innerText = parseFloat(
    ss.mean(Currant_Data_Graphing_Array_y[Graph_num])
  ).toPrecision(3);
  document.getElementById(`min${Graph_num}`).innerText = parseFloat(
    ss.min(Currant_Data_Graphing_Array_y[Graph_num])
  ).toPrecision(3);
  document.getElementById(`max${Graph_num}`).innerText = parseFloat(
    ss.max(Currant_Data_Graphing_Array_y[Graph_num])
  ).toPrecision(3);
  document.getElementById(`STD${Graph_num}`).innerText = parseFloat(
    ss.standardDeviation(Currant_Data_Graphing_Array_y[Graph_num])
  ).toPrecision(3);
  document.getElementById(`der${Graph_num}`).innerText = parseFloat(
    (Deration[Graph_num] * 100) / 1000
  ).toPrecision(3);
}

function Link(id) {
  Link_Flag = !Link_Flag;
  if (Link_Flag) {
    stop_lopping_flag = true;
    if (
      Currant_Data_Graphing_Array_x[0].length >
      Currant_Data_Graphing_Array_x[1].length
    ) {
      let NewDataX = File_Data_X[1].slice(
        Currant_Size_of_Graphing[1],
        Currant_Size_of_Graphing[1] +
          parseInt(Currant_Size_of_Graphing[0] - Currant_Size_of_Graphing[1])
      );
      let NewDataY = File_Data_y[1].slice(
        Currant_Size_of_Graphing[1],
        Currant_Size_of_Graphing[1] +
          parseInt(Currant_Size_of_Graphing[0] - Currant_Size_of_Graphing[1])
      );
      Currant_Data_Graphing_Array_x[1] =
        Currant_Data_Graphing_Array_x[1].concat(NewDataX);
      Currant_Data_Graphing_Array_y[1] =
        Currant_Data_Graphing_Array_y[1].concat(NewDataY);
      Currant_Size_of_Graphing[1] = Currant_Size_of_Graphing[0];
    } else {
      let NewDataX = File_Data_X[0].slice(
        Currant_Size_of_Graphing[0],
        Currant_Size_of_Graphing[0] +
          parseInt(Currant_Size_of_Graphing[1] - Currant_Size_of_Graphing[0])
      );
      let NewDataY = File_Data_y[0].slice(
        Currant_Size_of_Graphing[0],
        Currant_Size_of_Graphing[0] +
          parseInt(Currant_Size_of_Graphing[1] - Currant_Size_of_Graphing[0])
      );
      Currant_Data_Graphing_Array_x[0] =
        Currant_Data_Graphing_Array_x[0].concat(NewDataX);
      Currant_Data_Graphing_Array_y[0] =
        Currant_Data_Graphing_Array_y[0].concat(NewDataY);
      Currant_Size_of_Graphing[0] = Currant_Size_of_Graphing[1];
    }
  }
  document.getElementById(id).innerText = Link_Flag ? "Link On" : "Link off";
}

function relayout(ed, divs) {
  if (Object.entries(ed).length === 0) {
    return;
  }
  divs.forEach(async (div, i) => {
    let x = div.layout.xaxis;
    let x1 = divs[0].layout.xaxis;
    let y = divs[0].layout.yaxis;
    let x2 = divs[1].layout.xaxis;
    let y1 = divs[1].layout.yaxis;
    let flag = div == divs[0] ? 0 : 1;
    if (ed["xaxis.autorange"] && x.autorange) return;
    if (
      x.range[0] != ed["xaxis.range[0]"] ||
      x.range[1] != ed["xaxis.range[1]"]
    ) {
      var update = {
        // by5ly kol al var nfs al value
        "xaxis.range[0]": ed["xaxis.range[0]"],
        "xaxis.range[1]": ed["xaxis.range[1]"],
        // 'yaxis.range[0]':ed["yaxis.range[0]"],
        // 'yaxis.range[1]':ed["yaxis.range[1]"],
        "yaxis.autorange": ed["yaxis.autorange"],
        "xaxis.autorange": ed["xaxis.autorange"],
        "xaxis.rangeslider": ed["xaxis.rangeslider"],
      };
      if (typeof update["xaxis.range[0]"] == "undefined") {
        update["xaxis.range[0]"] = divs[0].layout.xaxis.range[0];
        update["xaxis.range[1]"] = divs[0].layout.xaxis.range[1];
      }
      if (Link_Flag) await Plotly.relayout(div, update);
    }
    if (
      y.range[0] >=
        parseFloat(ss.max(Currant_Data_Graphing_Array_y[0])).toPrecision(3) ||
      y.range[1] <=
        parseFloat(ss.min(Currant_Data_Graphing_Array_y[0])).toPrecision(3)
    ) {
      y.range[0] = parseFloat(
        ss.min(Currant_Data_Graphing_Array_y[0])
      ).toPrecision(3);
      y.range[1] = parseFloat(
        ss.max(Currant_Data_Graphing_Array_y[0])
      ).toPrecision(3);
      await Plotly.relayout(divs[0], {
        "yaxis.range[0]": y.range[0],
        "yaxis.range[1]": y.range[1],
      });
    }

    if (
      x1.range[1] <= Currant_Data_Graphing_Array_x[0][0] ||
      x1.range[0] >=
        Currant_Data_Graphing_Array_x[0][Currant_Size_of_Graphing[0] - 5]
    ) {
      await Plotly.relayout(divs[0], {
        "xaxis.range[0]": Currant_Data_Graphing_Array_x[0][0],
        "xaxis.range[1]": Currant_Data_Graphing_Array_x[0][0] + 2,
      });
    }
    if (
      y1.range[0] >=
        parseFloat(ss.max(Currant_Data_Graphing_Array_y[1])).toPrecision(3) ||
      y1.range[1] <=
        parseFloat(ss.min(Currant_Data_Graphing_Array_y[1])).toPrecision(3)
    ) {
      y1.range[0] = parseFloat(
        ss.min(Currant_Data_Graphing_Array_y[1])
      ).toPrecision(3);
      y1.range[1] = parseFloat(
        ss.max(Currant_Data_Graphing_Array_y[1])
      ).toPrecision(3);
      await Plotly.relayout(divs[1], {
        "yaxis.range[0]": y1.range[0],
        "yaxis.range[1]": y1.range[1],
      });
    }

    if (
      x2.range[1] <= Currant_Data_Graphing_Array_x[1][0] ||
      x2.range[0] >=
        Currant_Data_Graphing_Array_x[1][Currant_Size_of_Graphing[1] - 5]
    ) {
      await Plotly.relayout(divs[1], {
        "xaxis.range[0]": Currant_Data_Graphing_Array_x[1][0],
        "xaxis.range[1]": Currant_Data_Graphing_Array_x[1][0] + 2,
      });
    }
  });
}

function Scroll_NF(Graph_num) {
  scroll_flag[Graph_num] = scroll_flag[Graph_num] == "" ? {} : ""; // if condition btrsm al scroll
}

async function generatePDF() {
  let url0 = await Plotly.toImage(divs[0], {
    format: "jpeg",
    height: 300,
    width: 600,
  });
  let url1 = await Plotly.toImage(divs[1], {
    format: "jpeg",
    height: 300,
    width: 600,
  });
  makepdf(url0, 0);
  pdf.addPage();
  makepdf(url1, 1);

  pdf.save("Test.pdf");
}

function makepdf(url, Graph_num) {
  var img = new Image();
  img.src = url;
  pdf.setFontSize(20);
  pdf.addImage(img, "JPEG", 0, -10, 203, 130);
  pdf.text(`Graph number ${Graph_num}`, 20, 20);
  let y = 100;
  pdf.setLineWidth(2);
  pdf.text(`Table ${Graph_num} :`, 10, 120);
  pdf.autoTable({
    html: `#table${Graph_num}`,
    startY: 130,
    theme: "grid",
    columnStyles: {
      0: {
        halign: "left",
        tableWidth: 100,
      },
      1: {
        halign: "left",
        tableWidth: 100,
      },
      2: {
        halign: "left",
        tableWidth: 100,
      },
      3: {
        halign: "left",
        tableWidth: 100,
      },
    },
  });
}
