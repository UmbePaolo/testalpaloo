/// <reference path="Common.ts" />
/// <reference path="highcharts.js"/>


function loadGrafico() {
    var seriesArr = [];

    var highchartsOptions = Highcharts.setOptions({
        lang:
            {
                loading: 'Sto caricando...',
                months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
                weekdays: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
                shortMonths: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lugl', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
                exportButtonTitle: "Esporta",
                printButtonTitle: "Importa",
                rangeSelectorFrom: "Da",
                rangeSelectorTo: "A",
                rangeSelectorZoom: "Periodo",
                downloadPNG: 'Download immagine PNG',
                downloadJPEG: 'Download immagine JPEG',
                downloadPDF: 'Download documento PDF',
                downloadSVG: 'Download immagine SVG',
                printChart: 'Stampa grafico',
                thousandsSep: ".",
                decimalPoint: ','
            }
    });

    $.each(data.liftsTaken, function (key, d) {
        //var series = { name: data.userSurname, data: [], color: '#e84e1b' };

        //series.data.push(new Date(d.liftTime), d.arrAlt);
        //seriesArr.push(d.arrAlt);
        var t = new Date(d.liftTime);
        var dt = Date.UTC(t.getFullYear(), t.getMonth(), t.getDay(), t.getHours(), t.getMinutes(), t.getSeconds());

        var punto = {
            x: dt,
            y: d.arrAlt - d.difAlt,
            marker: {
                symbol: 'url(img/' + d.icon.replace("svg", "png") + ')'
            }
        };

        seriesArr.push(punto);

        var punto = {
            x: dt + 600000, //metto attualmente un viaggio di 10 minuti
            y: d.arrAlt
        };

        seriesArr.push(punto);
    });

    var options = {
        colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                 '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<b>{point.key}</b><br/>',
            pointFormat: '{point.y} mt'
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            },
            type: 'datetime',
            dateTimeLabelFormats: {
                minute: '%H:%M'
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                text: '',
                style: {
                    color: '#A0A0A3'
                }
            }, stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function (e) {
                            doMoveAtPoint(this.index);
                        }
                    }
                },
                marker: {
                    lineWidth: 1
                }
            }
        },
        chart: {
            color: '',
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                   [0, '#2a2a2b'],
                   [1, '#3e3e40']
                ]
            },
            //width:1263,
            type: 'line',
            plotBorderColor: '#606063'
        },
        series: [{}]
    };

    options.series[0].data = seriesArr;
    $("#myChart").highcharts(options);
    $(".highcharts-button").hide();

}