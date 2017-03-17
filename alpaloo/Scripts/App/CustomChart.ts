var Chart: any;
var myLineChart: any;

function loadGraph() {

    var chartQuoteData = [];

    var chartLiftData = [];

    var chartDiffData = [];

    var chartLabels = [];

    var chartLiftLabels = [];

    var chartLiftDisliv = [];

    var chartLiftSeconds = [];

    var chartLiftNames = [];

    var chartLifts = [];

    var chartOverrided = [];

    function getTime(arrAlt, date) {

        var minutes = arrAlt / 53;

        var t = moment(date).add(minutes, 'minutes');

        return t;

    }

    var startOfDay = moment(data.liftsTaken[0].liftTime).startOf('day');

    $.each(data.liftsTaken, function (key, lift) {
        //var series = { name: data.userSurname, data: [], color: '#e84e1b' };

        //series.data.push(new Date(d.liftTime), d.arrAlt);
        //seriesArr.push(d.arrAlt);
        //var t = new Date(d.liftTime);
        //var dt = Date.UTC(t.getFullYear(), t.getMonth(), t.getDay(), t.getHours(), t.getMinutes(), t.getSeconds());

        //var punto = {
        //    x: dt,
        //    y: d.arrAlt - d.difAlt,
        //    custImg: 'img/' + d.icon.replace("svg", "png"),
        //    custResort: d.liftName
        //    //,marker: {
        //    //    symbol: 'url(img/' + d.icon.replace("svg", "png") + ')'
        //    //}
        //};

        //seriesArr1.push(punto);

        //var punto = {
        //    x: dt + 300000, //metto attualmente un viaggio di 5 minuti
        //    y: d.arrAlt,
        //    custImg: 'img/' + d.icon.replace("svg", "png"),
        //    custResort: d.liftName
        //};

        //seriesArr2.push(punto);


        chartQuoteData.push(lift.arrAlt);
        chartDiffData.push(lift.difAlt);
        chartLabels.push(lift.liftTime);


        chartLiftData.push(lift.startAlt);
        chartLiftData.push(lift.arrAlt);
        chartLiftData.push(NaN);


        chartLiftLabels.push(moment(lift.liftTime).format('H:mm'));
        chartLiftLabels.push('');
        chartLiftLabels.push('');

        chartLifts.push(lift);
        chartLifts.push(lift);
        chartLifts.push(lift);

        chartLiftNames.push(lift.liftName);
        chartLiftNames.push(lift.liftName);
        chartLiftNames.push(lift.liftName);


        chartLiftSeconds.push(Math.abs(startOfDay.diff(lift.liftTime, 'seconds')));
        chartLiftSeconds.push(Math.abs(startOfDay.diff(getTime(lift.difAlt, lift.liftTime), 'seconds')));

    });

    var dislivChartOptions = {

        responsive: false,
        spanGaps: true,

        hover: {
            animationDuration: 0
        },


        elements: {
            line: {
                borderWidth: 2,
                tension: 0.4,
                borderColor: 'rgba(232, 78, 27, 0.43)',
                backgroundColor: '#e84e1b',
                fill: false

            },
            point: {
                pointBorderColor: '#506d7a',
                pointBackgroundColor: '#e84e1b',
                radius: 5

            }
        },

        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'right',

                    gridLines: {

                        display: false
                    },
                    ticks: {
                        beginAtZero: false,

                        userCallback: function (meters) {

                            return meters + 'mt';
                        }
                    }
                }
            ],
            xAxes: [
                {

                    id: 'x-axis-1',
                    display: true,
                    position: 'bottom'
                }

            ]
        }

    };

    var liftChartOptions = {

        responsive: false,
        legend: {
            display: false
        },
        hover: {
            animationDuration: 0
        },
        animation: {
            duration: 1,
            onComplete: function () {
                var chartInstance = this.chart,
                    ctx = chartInstance.ctx;
                ctx.font = Chart.helpers.fontString(
                    Chart.defaults.global.defaultFontSize,
                    Chart.defaults.global.defaultFontStyle,
                    Chart.defaults.global.defaultFontColor
                );
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                //this.data.datasets.forEach(function (dataset, i) {
                //    var meta = chartInstance.controller.getDatasetMeta(i);
                //    meta.data.forEach(function (bar, index) {
                //        var dato = chartLiftNames[index]

                //        //if (dato != '') {
                //        //    ctx.fillText(dato, bar._model.x, bar._model.y - 20);
                //        //}

                //    });
                //});
            }
        },
        elements: {
            line: {
                borderWidth: 4,
                tension: 0.0,
                borderColor: '#e84e1b',
                backgroundColor: '#e84e1b',
                fill: false
            },
            point: {
                pointBorderColor: '#506d7a',
                radius: 15

            }
        },
        tooltips: {
            enabled: false,
            custom: function (tooltip) {
                // Tooltip Element
                var tooltipEl = document.getElementById('chartjs-tooltip');
                // Hide if no tooltip
                if (tooltip.opacity === 0) {
                    tooltipEl.style.opacity = '0';
                    return;
                }
                // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltip.yAlign) {
                    tooltipEl.classList.add(tooltip.yAlign);
                } else {
                    tooltipEl.classList.add('no-transform');
                }
                function getBody(bodyItem) {
                    return bodyItem.lines;
                }
                var indice = tooltip.dataPoints[0].index;
                var lift = <namespace.ILiftsTaken>chartLifts[indice];
                // Set Text
                if (tooltip.body) {
                    var liftName = chartLiftNames[indice];
                    var d = chartLiftData[indice];
                    var i = lift.icon;
                    var custImg = '';
                    if (i) {
                        custImg = 'img/' + i.replace("svg", "png");
                    }
                    var titleLines = tooltip.title || [];
                    var bodyLines = tooltip.body.map(getBody);
                    var innerHtml = '<tr><td rowspan="2">' + '<img src="' + custImg + '" title="" alt="" border="0">' + '</td>';
                    innerHtml += '<th>' + liftName + '</th></tr>';

                    bodyLines.forEach(function (body, i) {
                        var colors = tooltip.labelColors[i];
                        var style = 'background:' + colors.backgroundColor;
                        style += '; border-color:' + colors.borderColor;
                        style += '; border-width: 2px';
                        var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                        innerHtml += '<tr><td>' + span + d + ' mt</td></tr>';
                    });
                    var tableRoot = <HTMLTableElement>tooltipEl.querySelector('table');
                    tableRoot.innerHTML = innerHtml;
                }
                var position = this._chart.canvas;//.getBoundingClientRect();
                // Display, position, and set styles for font
                tooltipEl.style.opacity = '1';
                tooltipEl.style.left = position.offsetLeft + tooltip.caretX + 'px';
                tooltipEl.style.top = position.offsetTop + tooltip.caretY + 'px';
                //tooltipEl.style.left = tooltip.chart.canvas.offsetLeft + tooltip.x + 'px';
                //tooltipEl.style.top = tooltip.chart.canvas.offsetTop + tooltip.y + 'px';
                tooltipEl.style.fontFamily = tooltip._fontFamily;
                tooltipEl.style.fontSize = tooltip.fontSize;
                tooltipEl.style.fontStyle = tooltip._fontStyle;
                tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';

                doMoveAtPoint(Math.round(indice * 2 / 3));
            }
        },
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left',

                    gridLines: {

                        display: true

                    },
                    ticks: {
                        beginAtZero: false,
                        userCallback: function (meters, index) {

                            return meters + 'mt';
                        }
                    }
                },
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'right',
                    gridLines: {

                        display: true

                    },
                    ticks: {
                        beginAtZero: false,
                        userCallback: function (meters, index) {

                            return meters + 'mt';
                        }
                    }
                }

            ],
            xAxes: [
                {

                    id: 'x-axis-1',
                    display: true,
                    position: 'bottom'
                }
            ]
        }
    };

    var ctx = (<HTMLCanvasElement>document.getElementById("myChart")).getContext("2d");

    var chartData = {
        labels: chartLiftLabels,
        datasets: [
            {
                data: chartLiftData,
                borderWidth: 0,
                type: 'line',
                spanGaps: false,
                beginAtZero: false,
                pointRadius: 5,
                pointHoverRadius: 5,
                pointHitRadius: 5,
                pointBackgroundColor: '#506d7a'
            },
            {
                data: chartLiftData,
                borderWidth: 10,
                type: 'line',
                borderDash: [6, 3],
                borderColor: '#e84e1b',
                pointBorderWidth: 1,
                radius: 0,
                beginAtZero: false
            },
            {
                data: chartLiftData,
                borderWidth: 0,
                borderColor: 'rgba(80, 109, 122, 0.41)',
                type: 'line',
                spanGaps: true,
                radius: 0,
                beginAtZero: false
            }
        ]
    };

    myLineChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: liftChartOptions
    });
}