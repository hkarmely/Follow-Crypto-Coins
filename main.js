$().ready(function () {
    //  A promis with AJAX call, calling createCoinCardfunction for every single card retrived
    async function buildPAge() {
        try {
            const cryptoCoinsList = await getDataAsync(
                "https://api.coingecko.com/api/v3/coins/"
            );
            $("#dialog").empty();

            for (let i = 0; i < 20; i++) {
                createCoinCard(cryptoCoinsList[i]);
            }
            // for (const singleCoin of cryptoCoinsList) {
            //     createCoinCard(singleCoin);
            // }

            $.ajax({
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();

                    // Upload progress
                    xhr.upload.addEventListener(
                        "progress",
                        function (evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = evt.loaded / evt.total;
                                //Do something with upload progress
                                console.log(percentComplete);
                            }
                        },
                        false
                    );

                    // Download progress
                    xhr.addEventListener(
                        "progress",
                        function (evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = evt.loaded / evt.total;
                                // Do something with download progress
                                console.log(percentComplete);
                            }
                        },
                        false
                    );

                    return xhr;
                },
                type: "POST",
                url: "/",
                data: {},
                success: function (data) {
                    // Do something success-ish
                }
            });
        } catch (err) {
            alert("Error: " + err.status);
        }
    }
    buildPAge();

    //maikng  AJAX Call with a url parameter
    function getDataAsync(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                success: (data) => resolve(data),
                reject: (err) => reject(err)
            });
        });
    }

    // function to create and present single Coin
    // can change to thicker checkbox from example https://www.w3schools.com/howto/howto_css_switch.asp

    const createCoinCard = function (singleCoin) {
        const $card = $(`<div class="col" class="collapse in">
          <div class="card" style="width: 19rem;">
              <div class="card-body">
                      <h5 class="card-title">${singleCoin.symbol.toUpperCase()}</h5>
                      <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
                      </div>    
                      <p class="card-text"> ${singleCoin.name}</p>
                      <p></p>
                      <a class="moreInfo btn btn-primary">More Info</a>
                      <div id ="${singleCoin.id}" style = "display:none;"> </div>
              </div>    
          </div>    
      </div>`);

        //linking checkboxes (on card) count check function
        $card.find("input[type=checkbox]").on("click", countChecked);

        //linking moreinfo butoon (on card) to moreCoinInfo function
        $card.find("a.moreInfo").on("click", function () {
            console.log(singleCoin.id);
            moreCoinInfo(singleCoin.id, this);
        });

        //appending the card
        $("#dialog").append($card);
    };

    //countChecked functin counts all checked checkboes and retrives a
    var countChecked = function () {
        var n = $("input:checked").length;
        if (n === 4) {
            $("div:hidden").show();
        }

        // n < 6
        //     ? console.log(n + (n === 1 ? " is" : " are") + " checked!")
        //     : console.log("no more checks");

        if (n < 6 && n > 0) {
            console.log(n + (n === 1 ? " is" : " are") + " checked!")

            let allCheckedOotions = Object.entries(
                $("input:checked").parent().prev()
            );
            allCheckedOotions.splice(-2);
            createOngoingGraph(
                allCheckedOotions.reduce(
                    (accumulator, currentValue, currentIndex, array) => {
                        return (
                            accumulator + allCheckedOotions[currentIndex][1].outerText + ","
                        );
                    },
                    ""
                )
            );






            // let allCheckedOotions = Object.entries(
            //     $("input:checked").parent().prev()
            // );
            // allCheckedOotions.splice(-2);
            // console.log(allCheckedOotions);
            // console.log(Array.isArray(allCheckedOotions));
        }

        if (n === 6) {
            console.log(" no more checks: max 5");
            $(this).prop("checked", false);

            // console.log(
            //     allCheckedOotions.reduce(
            //         (accumulator, currentValue, currentIndex, array) => {
            //             return (
            //                 accumulator + allCheckedOotions[currentIndex][1].outerText + ","
            //             );
            //         },
            //         ""
            //     )
            // );

            // outerText

            // for (const element of allCheckedOotions) {
            //     console.log(element.outerText);
            // }
            //select all uncheckd and toggle
            console.log("All uncheced options:");
            $(":checkbox:not(:checked)").parent().parent().parent().parent().hide();
        }
    };

    countChecked();

















    //a prominss for calling more info after pressing more info butoon on card
    var moreCoinInfo = async function (id, clickObject) {
        // console.log("This is id from line 194");
        // console.log(id);
        // console.log("And it's type is");
        // console.log(typeof id);

        try {
            // chedking if ther is information in local storage usind helper function
            if (callSrotage(`${id}`)) {
                const singleCoinData = callSrotage(`${id}`);
                console.log("this is singleCoinData from local storage line 202");
                console.log(singleCoinData);
                console.log(typeof singleCoinData);
                prestenMoreInfo(id, singleCoinData, clickObject);
            }
            else {
                const singleCoinData = await getDataAsync(
                    `https://api.coingecko.com/api/v3/coins/${id}`
                );
                // adding data to local storate with helper function to
                updateSrotage(`${id}`, singleCoinData)
                console.log("this is singleCoinData from AJAX call line 212");
                console.log(singleCoinData);
                console.log(typeof singleCoinData);
                prestenMoreInfo(id, singleCoinData, clickObject);
                // removeing from memory after two minutes as asked
                setTimeout(() => {
                    sessionStorage.removeItem(`${id}`);
                }, 120000);

            }

        } catch (err) {
            alert("Error: " + err.status);
        }
    };


    // Helper function for sroting object in sessionStorage as JSON
    function updateSrotage(key, objectToStore) {
        const updateObjectJSON = JSON.stringify(objectToStore);
        sessionStorage.setItem(key, updateObjectJSON);
    }

    //  Helper function for getting object from sessionStorage as JSON
    function callSrotage(key) {
        const getObject = JSON.parse(sessionStorage.getItem(key));
        return (getObject);
    }



    //prestenMoreInfo into the card AJAX or localStorage call succieds
    const prestenMoreInfo = function (id, coinJson, clickObject) {
        console.log(id);
        console.log(coinJson);
        console.log(
            `<img src=${coinJson.image.thumb} alt="${coinJson.name} image icon" width="100" height="100">`
        );
        console.log(coinJson.market_data.current_price.usd);
        console.log(coinJson.market_data.current_price.eur);
        console.log(coinJson.market_data.current_price.ils);

        console.log(`<img src=${coinJson.image.thumb} alt="${coinJson.name} image icon" width="100" height="100"> 
          ${coinJson.market_data.current_price.usd} USD 
          ${coinJson.market_data.current_price.eur} EUR 
          ${coinJson.market_data.current_price.ils} ILS 
          `);
        console.log(clickObject);
        console.log($(clickObject).next());
        console.log("This is html before");
        console.log($(clickObject).next().html());
        console.log("This is html type");
        console.log(typeof $(clickObject).next().html());
        $(clickObject).next()
            .html(`<img src=${coinJson.image.thumb} alt="${coinJson.name} image icon"> 
          ${coinJson.market_data.current_price.usd} USD 
          ${coinJson.market_data.current_price.eur} EUR 
          ${coinJson.market_data.current_price.ils} ILS 
          `);
        console.log("This is html after");
        console.log($(clickObject).next().html());
        $(clickObject).next().toggle();

        // (!($(clickObject).next().html === "")) ? $(clickObject).next().html(`<img src=${coinJson.image.thumb} alt="${coinJson.name} image icon">
        //     ${coinJson.market_data.current_price.usd} USD
        //     ${coinJson.market_data.current_price.eur} EUR
        //     ${coinJson.market_data.current_price.ils} ILS
        //     `) : $(clickObject).next().html === "";
    };

    //Search Button function
    $("#myBtn2").click(function () {
        $("#pills-home-tab").click();
        var str = $("#myInput2").val().toUpperCase();
        // console.log(str);
        // console.log(
        //   $(".card-title").filter(function () {
        //     console.log($(this).text() === str);
        //   })
        // );
        // console.log($(".card-title").filter(function () {
        //         return $(this).text() == str;
        //     })
        // );

        console.log(
            $(".card-title")
                .filter(function () {
                    return $(this).text() === str;
                })
                .parent()
                .parent()
                .parent()
        );

        $(".card-title")
            .filter(function () {
                return $(this).text() === str;
            })
            .parent()
            .parent()
            .parent()
            .show();

        $(".card-title")
            .filter(function () {
                return $(this).text() !== str;
            })
            .parent()
            .parent()
            .parent()
            .hide();


    });


    // Show all when you go back to home page after search
    $("#pills-home-tab").on("click", function () {
        console.log("works");
        $(".card-title")
            .filter(function () {
                return true;
            })
            .parent()
            .parent()
            .parent()
            .show();
    });




    //show and hide an AJAX progress bar
    // ולגבי מיקום: https://stackoverflow.com/questions/7576342/css-to-keep-element-at-fixed-position-on-screen
    $(document).ajaxStart(function () {
        console.log("Triggered ajaxStart handler.");
        $("#divImageLoade").show();
    });
    $(document).ajaxStop(function () {
        console.log("Triggered ajaxStop handler.");
        $("#divImageLoade").hide();
    });




    // Create charts with library (ongoing multy chart)
    const createOngoingGraph = function (listOfCoins) {

        console.log("hello chen from multicharts");
        var coinDataPoints1 = [];
        var coinDataPoints2 = [];
        var coinDataPoints3 = [];
        var coinDataPoints4 = [];
        var coinDataPoints5 = [];
        var arr5 = [coinDataPoints1, coinDataPoints2, coinDataPoints3, coinDataPoints4, coinDataPoints5];

        $.getJSON(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${listOfCoins}&tsyms=USD`, function (data) {

            // Object.entries takes the date and pharse it into an array, and there for i can run on it with an index!!!!
            let arrrrr = Object.entries(data);
            let beginDate = Date.now();
            arrrrr.reduce(function (accumulator, currentValue, currentIndex, array) {
                arr5[currentIndex].push({
                    x: beginDate,
                    y: (currentValue[1]["USD"])
                });
            }, 0)

            // Creating the graphData array
            const graphData = [];
            arrrrr.reduce(function (accumulator, currentValue, currentIndex, array) {
                graphData.push({
                    type: "line",
                    xValueType: "dateTime",
                    yValueFormatString: "###.00 USD",
                    xValueFormatString: "hh:mm:ss TT",
                    showInLegend: true,
                    name: `${currentValue[0]}`,
                    dataPoints: arr5[currentIndex]
                });
            }, 0)

            console.log(graphData);


            var options = {
                title: {
                    text: "Your Slected Crypto Currncy"
                },
                axisX: {
                    title: "chart updates every 2 secs"
                },
                axisY: {
                    suffix: "USD"
                },
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    verticalAlign: "top",
                    fontSize: 22,
                    fontColor: "dimGrey",
                    itemclick: toggleDataSeries
                },
                data: graphData
            };


            console.log(options);

            var chart2 = $("#pills-profile").CanvasJSChart(options);

            function toggleDataSeries(e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                }
                else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }

            // update function
            function updateChart() {

                $.getJSON(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${listOfCoins}&tsyms=USD`, function (data2) {

                    // Object.entries takes the date and pharse it into an array, and there for i can run on it with an index!!!!
                    let arrrrr2 = Object.entries(data2);
                    let beginDate2 = Date.now();
                    arrrrr2.reduce(function (accumulator, currentValue, currentIndex, array) {
                        arr5[currentIndex].push({
                            x: beginDate2,
                            y: (currentValue[1]["USD"])
                        });

                        // // updating legend text with  updated with y Value 
                        options.data[currentIndex].legendText = `${currentValue[0]}: ${currentValue[1]["USD"]}USD`;


                    }, 0)
                });

                $("#pills-profile").CanvasJSChart().render();
            }


            var updateInterval2 = 2000;
            setInterval(function () { updateChart() }, updateInterval2);

            // end of getJSOn - do not delete
        });
        // end of getJSOn - do not delete
    }




});


