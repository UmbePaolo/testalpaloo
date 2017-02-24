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
            custImg: 'img/' + d.icon.replace("svg", "png"),
            custResort: d.liftName
            //,marker: {
            //    symbol: 'url(img/' + d.icon.replace("svg", "png") + ')'
            //}
        };

        seriesArr.push(punto);

        var punto = {
            x: dt + 300000, //metto attualmente un viaggio di 5 minuti
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
            useHTML: true,
            formatter: function () {
                var custImg = this.point.custImg;
                var custResort = this.point.custResort;
                var dato = '';// '<b>' + new Date(this.point.category).toTimeString().split(' ')[0] + '</b><br/>' + this.point.y + ' mt';
                if (custImg) {
                    dato = '<img src="' + custImg + '" title="" alt="" border="0">' + dato;
                }
                if (custResort) {
                    dato = dato + '<b>' + custResort + '</b><br/>';
                }
                return '<div style="width:100px; height:50px;">' + dato + this.point.y + ' mt</div>';
            },
            backgroundColor: '#e84e1b'
        },
        //tooltip: {
        //    //headerFormat: '<b>{point.key}</b><br/>',
        //    //pointFormat: '{point.y} mt',
        //    seHTML: true,
        //    formatter: function () {
        //        var cust = this.point.cust;
        //        if (cust) {
        //            return '<img src="' + cust + '" />' + '<b>' + this.point.y + '</b>';
        //        }
        //    }
        //},
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
                minute: '%H:%M:%S'
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
                allowPointSelect: true,
                marker: {
                    enabled:true,
                    states: {
                        select: {
                            enabled:true,
                            fillColor: 'red',
                            radius: 6
                        }
                    }
                },
                point: {
                    events: {
                        click: function (e) {
                            doMoveAtPoint(this.index);
                        }
                    }
                }
            }
        },
        chart: {
            color: '',
            //width:1263,
            renderTo: $("#myChart")[0],
            type: 'line',
            plotBorderColor: '#606063'
        },
        series: [{}]
    };

    options.series[0].data = seriesArr;
    myChart = new Highcharts.Chart(options);
    myChart.series[0].points[0].select();
    
    $(".highcharts-button").hide();

}