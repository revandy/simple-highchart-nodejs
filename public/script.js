//Jquery Selector
    $(function(){
       showChartData()
       getData()
    })

    function getFormattedDate(date) {
        const dateString = date; // ISO8601 compliant dateString
        const D = new Date(dateString);// {object Date}
        var DAY = D.getDate()
        var MONTH = D.getMonth()
        var YEAR = D.getFullYear()
        var month_name = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        var data = {
            date_html: DAY+'-'+month_name[MONTH]+'-'+YEAR,
            get_month_name: month_name[MONTH]
        }
        return data
    }
    async function getData(){
        const response = await fetch('/data');
        const json = await response.json();
        num = 0;
        for(var i=0;i < json.length; i++){
            var category = json[i].category
            var date = getFormattedDate(json[i].date)
            var id_data = json[i].id
            $( "#date_category" ).append( '<option value="'+num+'">'+category+' '+date['date_html']+'</option>' );
            num++
        }
    }
    async function getDataById(id){
        const response = await fetch('/data');
        const json = await response.json();
        num = 0;
        for(var i=0;i < json.length; i++){
            if(i == id){
                var data = {
                    category: json[i].category,
                    date: json[i].date,
                    achievement: json[i].achievement,
                    target: json[i].target
                }
                
                showChartData(data)
                return
            }
        }
    }
    $('#date_category').on('change', async function(){
        let id = document.getElementById('date_category').value
        const url = `data`;
        const response = await fetch(url);
        const json = await response.json();
        var datas = getDataById(id)
        console.log(datas);
    });
    function showChartData(data = []){
        console.log(data)
        var get_month = getFormattedDate(data['date'])
        $('#container').highcharts({
            chart: {
                type: 'column',
            },
          
            title: {
                text: data['category']
            },
            legend: {
                layout: 'horizontal',
                color: '#FF0000',
                "align": "center",
                backgroundColor: '#FFFFFF',
                labelFormatter: function () {
                    return this.name;
                }
            },
            xAxis: {
                type: 'category',
                labels: {
                    formatter: function() {
                        var placeholder = Number(this.value);
                        if (!!placeholder) {
                            return ""
                        }
                        //var obj = data[this.value];
                        if (this.axis.series[0].levelNumber == 1 && !this.isFirst) {
                            return '';
                        } else {
                            return this.value;
                        }
                    }
                },
                crosshair: true,
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [
                {
                    "showInLegend": true,
                    color: "gray",
                    name: "target",
                    stack: "target",
                    date: get_month['get_month_name'],
                    data: [
                        {
                            color: "gray",
                            name: get_month['get_month_name'],
                            y: data['target'],
                        }],
                },
                {
                    "showInLegend": true,
                    name: "delta",
                    stack: "delta",
                    color: "green",
                    date: get_month['get_month_name'],
                    data: [{
                            color: "transparent",
                            name: get_month['get_month_name'],
                            y: data['target']
                        },
                        {
                            color: "green",
                            name: get_month['get_month_name'],
                            y: data['achievement'] - data['target']
                        }],
                    
                },
                {
                    "showInLegend": true,
                    name: "achievement",
                    stack: "achievement",
                    color: "black",
                    date: get_month['get_month_name'],
                    data: [{
                            name: get_month['get_month_name'],
                            y: data['achievement']
                        }],
                },
            ]
        });
    }