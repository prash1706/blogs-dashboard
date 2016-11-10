var verEnv = 'dev';
// var verEnv = 'prod';
var blogs = [];
var blogData = {};
var themeData = {};
var pluginData = {};
var userData = {};
var pageData = {};
var googleResults = null;
var currentVersion = 'prod';
var startStyle = '.6s linear 0s normal none infinite ibm-spinner-kf-spin,5.6s ease-in-out 0s normal none infinite ibm-spinner-kf-colors';
var stopStyle = '.0s linear 0s normal none infinite ibm-spinner-kf-spin,5.6s ease-in-out 0s normal none infinite ibm-spinner-kf-colors'
jQuery(function($) {
  reset();
  dashBoardRun();

  $('.card').click(function() {
    if ($(this).hasClass('myTable')) {
      return;
    }
    if ($('.tableDiv').hasClass('card1')) {
      $('#table1').hide();
      $('.tableDiv').removeClass('card1');
    } else if ($('.tableDiv').hasClass('card2')) {
      $('#table2').hide();
      $('.tableDiv').removeClass('card2');
    } else if ($('.tableDiv').hasClass('card3')) {
      $('#table3').hide();
      $('.tableDiv').removeClass('card3');
    } else if ($('.tableDiv').hasClass('card4')) {
      $('#table4').hide();
      $('.tableDiv').removeClass('card4');
    } else if ($('.tableDiv').hasClass('card5')) {
      $('#table5').hide();
      $('.tableDiv').removeClass('card5');
    } else if ($('.tableDiv').hasClass('card6')) {
      $('#table6').hide();
      $('.tableDiv').removeClass('card6');
    } else if ($('.tableDiv').hasClass('card7')) {
      $('#table7').hide();
      $('.tableDiv').removeClass('card7');
    }
    $('#table1').hide();
    $('#table2').hide();
    $('#table3').hide();
    $('#table4').hide();
    $('#table5').hide();
    $('#table6').hide();
    $('#table7').hide();

    $('#table').show();
    $('.tableDiv').addClass(this.id);
    $('#main').addClass('showTable');
    $('.myTable').removeClass('myTable');
    $(this).addClass('myTable');
    if (this.id === 'card1') {
      calTable1();
    } else if (this.id === 'card2') {
      calTable2();
    } else if (this.id === 'card3') {
      calTable3();
    } else if (this.id === 'card4') {
      calTable4();
    } else if (this.id === 'card5') {
      calTable5();
    } else if (this.id === 'card6') {
      calTable6();
    } else if (this.id === 'card7') {
      calTable7();
    }
  })

  $('a.showFilters').click(function() {
    for (i in $('.tableDivChild')) {
      if ($.contains($('.tableDivChild')[i], this)) {
        $($('.tableDivChild')[i]).addClass('showThisTableFilter')
        break;
      }
    }
  })

  $('a.hideFilters').click(function() {
    var thisID = '';
    for (i in $('.showThisTableFilter')) {
      if ($.contains($('.showThisTableFilter')[i], this)) {
        thisID = $($('.showThisTableFilter')[i]).attr('id');
        $($('.showThisTableFilter')[i]).removeClass('showThisTableFilter')
        break;
      }
    }
    if (thisID === 'table1') {
      setTimeout(resetTable1Filters(), 500);
    } else if (thisID === 'table2') {
      setTimeout(resetTable2Filters(), 500);
    } else if (thisID === 'table5') {
      setTimeout(resetTable5Filters(), 500);
    } else if (thisID === 'table7') {
      setTimeout(resetTable7Filters(), 500);
    }
  })

  $('.table1Filter').on("change", function() {
    if (blogData.rows != undefined) {
      updateTable1($('#table1Filter1').val(), $('#table1Filter2').val());
    }
  });

  $('.table2Filter').on("change", function() {
    if (themeData.rows != undefined) {
      updateTable2($('#table2Filter1').val(), $('#table2Filter2').val(), $('#table2Filter3').val());
    }
  });

  $('.table5Filter').on("change", function() {
    if (pluginData.rows != undefined) {
      updateTable5($('#table5Filter1').val(), $('#table5Filter2').val(), $('#table5Filter3').val(), $('#table5Filter4').val(), $('#table5Filter5').val());
    }
  });

  $('.table7Filter').on("change", function() {
    if (pageData.rows != undefined) {
      updateTable7($('#table7Filter1').val(), $('#table7Filter2').val(), $('#table7Filter3').val());
    }
  });

  $('#backToMenu').click(function() {
    $('.myTable').removeClass('myTable');
    $('#main').removeClass('showTable');
    $('#table').hide();
  })

  $('#switchVersion').on("change", function() {
    reset();
    currentVersion = $('#switchVersion').val();
    dashBoardRun();
  });

  $('#moreInfoDiv').hover(function() {}, function() {
    $('#moreInfoDiv').hide();
    $('.showBlogMenu').removeClass('showBlogMenu');
  })

  $('#moreInfoDiv p:nth-child(3) a').click(function() {
    var blogname = $(this).attr('blogname');
    $('#rawData').show();
    $('#jsonContent').show();
    $('#jsonContent #loading').show();
    $('#jsonContentTitle p:nth-child(1)').text(blogname);
    $('body').css("overflow", "hidden");
    $.ajax({
      url: "/blogName/" + blogname,
      success: function(result) {
        if (result.blog != undefined) {
          $('#jsonContent #loading').hide();
          var formatter = new JSONFormatter(result.blog);
          document.getElementById('jsonRawDataArea').appendChild(formatter.render());
        }
      }
    });
  });

  $('#jsonContentTitle p.ibm-icononly a.ibm-close-link').click(function() {
    $('#rawData').hide();
    $('#jsonContent').hide();
    $('body').css("overflow", "auto");
    $('#jsonContent div.json-formatter-row').remove();
  })
  $('#rawData').click(function() {
    $('#rawData').hide();
    $('#jsonContent').hide();
    $('body').css("overflow", "auto");
    $('#jsonContent div.json-formatter-row').remove();
  })

  $('#loadingMockupSpinner p.ibm-ind-link a').click(function() {
    reset();
    dashBoardRun();
  });

  // 1st Card
  function calBlogCount() {
    var count = blogs.total_rows;
    $('#card1 .cardValue').text(count + ' blogs');
  }

  // 2nd Card
  function calStaThe() {
    var standThe = 0;
    var activeCount = 0;
    var currentTime;
    for (i in blogs.rows) {
      var themes = blogs.rows[i].value.themeDetails;
      for (j in themes) {
        if ((themes[j].themeName === 'ibmNorthstar' || themes[j].themeName === 'ibmNorthstarLST') && (themes[j].version.substr(0, 3) === '1.6') && themes[j].status === 'active') {
          standThe++;
        }
        if (themes[j].status === 'active') {
          ifActive = true;
          activeCount++;
        }
      }
      if (i == blogs.rows.length - 1) {
        currentTime = blogs.rows[i].value.reportDate;
        var list = currentTime.split(' ');
        if (list.length === 6) {
          var month = list[1];
          var day = list[2];
          var time = list[3];
          var zone = list[4];
          var year = list[5];
          var dateTime = day + " " + month + " " + year + " " + time.slice(0, 5) + " " + zone;
          $('#currentTime span:nth-child(2)').text(dateTime);
        } else {
          $('#currentTime span:nth-child(2)').text(currentTime);
        }
      }
    };
    $('#card2 .cardValue').text(getPercent(standThe, activeCount) + ' themes');
  }

  // 3rd Card
  function calCurDay() {
    var nowTime = new Date();
    var nowDate = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), 0, 0, 0);
    var disTime = nowDate.getTime();
    var disDayList = [];
    for (i in blogs.rows) {
      var posts = blogs.rows[i].value.postDate;
      var mostCurDate = '';
      for (var j = 0; j < posts.length; j++) {
        if (j === 0) {
          mostCurDate = posts[0];
        } else {
          if (getTimeToTime(mostCurDate) < getTimeToTime(posts[j])) {
            mostCurDate = posts[j];
          }
        };
      };
      var result = calTime(mostCurDate, disTime);
      if (result != -1) {
        disDayList.push(result);
      }
    };
    var totalDay = 0;
    for (i in disDayList) {
      totalDay += disDayList[i];
    }
    var result = totalDay / disDayList.length + '';
    result = result.substr(0, result.indexOf('.'))
    $('#card3 .cardValue').text(result + ' days');
  }

  // 4th Card
  function calPost() {
    var count = 0;
    var nowTime = new Date();
    var nowDate = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), 0, 0, 0);
    var disTime = nowDate.getTime();
    var maxTime = disTime - (nowTime.getDay() + 1) * (1000 * 60 * 60 * 24);
    var minTime = disTime - (nowTime.getDay() + 8) * (1000 * 60 * 60 * 24);
    for (i in blogs.rows) {
      var posts = blogs.rows[i].value.postDate;
      for (j in posts) {
        var postTime = getTimeToTime(posts[j]);
        if (postTime !== undefined) {
          if (postTime <= maxTime && postTime >= minTime) {
            count++;
          }
        }
      }
    };

    $('#card4 .cardValue').text(count + ' posts');
  }

  // 5th Card
  function calPlugin() {
    var totalCount = 0;
    var activeCount = 0;
    for (i in blogs.rows) {
      var plugins = blogs.rows[i].value.pluginDetails;
      for (j in plugins) {
        totalCount++;
        if (plugins[j].status === "active") {
          activeCount++;
        }
      }
    }
    $('#card5 .cardValue').text(getPercent(activeCount, totalCount) + ' plug-ins');
  }
  // 6th Card
  function calAuthor() {
    var userList = [];
    for (i in blogs.rows) {
      var users = blogs.rows[i].value.users;
      for (j in users) {
        if (userList.indexOf(users[j].usersEmail) === -1) {
          userList.push(users[j].usersEmail);
        } else {
          continue;
        }
      }
    };
    $('#card6 .cardValue').text(formatNumber(userList.length) + ' users');
  }

  // 7th Card
  function calPages() {
    var pageCount = 0;
    var blogCount = blogs.rows.length;
    for (i in blogs.rows) {
      pageCount += blogs.rows[i].value.pageCount;
    }
    $('#card7 .cardValue').text(getPercent2(pageCount, blogCount) + ' pages')
  }

  // 1st Table
  function calTable1() {
    $('#table1').hide();
    $('#tableLoading').show();
    $('#table h2').text('Details: Blogs');
    if (blogData.rows != undefined) {
      updateTable1($('#table1Filter1').val(), $('#table1Filter2').val());
      console.log('blogDetails', blogData);
      if ($('.tableDiv').hasClass('card1')) {
        $('#table1').show();
        $('#table1 table').DataTable().search('').draw();
        $('#tableLoading').hide();
      }
    } else {
      $.ajax({
        url: '/blogDetails?version=' + currentVersion,
        success: function(result) {
          blogData = result;
          console.log('blogDetails', result);
          updateFilter1();
          updateTable1($('#table1Filter1').val(), $('#table1Filter2').val());
          if ($('.tableDiv').hasClass('card1')) {
            $('#table1').show();
            $('#table1 table').DataTable().search('').draw();
            $('#tableLoading').hide();
          }
        },
        error: function(error) {
          console.error('blogDetails Error', error);
          blogData = {};
        }
      })
    }

    function updateFilter1() {
      var counList = [];
      var languList = [];
      for (i in blogData.rows) {
        var blog = blogData.rows[i].value;
        if (!blog.country || !blog.language) {
          continue;
        }
        if (counList.indexOf(blog.country) === -1) {
          counList.push(blog.country);
        }
        if (languList.indexOf(blog.language) === -1) {
          languList.push(blog.language);
        }
      }
      counList.sort();
      languList.sort();
      for (i in counList) {
        $('#table1Filter1').append('<option value=' + counList[i] + '>' + counList[i] + '</option>');
      }

      for (i in languList) {
        $('#table1Filter2').append('<option value=' + languList[i] + '>' + languList[i] + '</option>');
      }
    }
  }

  function updateTable1(filterCountry, filterLanguage) {
    $('#table1 table').DataTable().destroy();
    $('#table1 table tbody').remove();
    var tr = '<tbody>';
    for (i in blogData.rows) {
      var blog = blogData.rows[i].value;
      if (filterCountry !== 'all' && blog.country !== filterCountry) {
        continue;
      }
      if (filterLanguage !== 'all' && blog.language !== filterLanguage) {
        continue;
      }
      var oldPost = 0;
      var newPost = 0;
      var halfYearCount = 0;
      var postCount = blog.postDetails.length;
      var owner = blog.owner == undefined ? '' : blog.owner;
      var country = blog.country == undefined ? '' : blog.country;
      var language = blog.language == undefined ? '' : blog.language;
      var mu = blog.mu == undefined ? '' : blog.mu;
      var halfYearTime = new Date();
      halfYearTime.setMonth(halfYearTime.getMonth() - 6);
      if (blog.totalPosts > 0) {
        newPost = getTimeToTime(blog.postDetails[0].postDate);
        oldPost = getTimeToTime(blog.postDetails[blog.totalPosts - 1].postDate);
      } else {
        oldPost = "";
        newPost = "";
      }
      for (j in blog.postDetails) {
        var post = blog.postDetails[j];
        var postTime = getTimeToTime(post.postDate);
        if (halfYearTime <= postTime) {
          halfYearCount++;
        }
        if (oldPost > postTime) {
          oldPost = postTime;
        }
        if (newPost < postTime) {
          newPost = postTime
        }
      }
      tr += '<tr><td><span>' + blog.blogName + '</span><a class="jumpLink"><img src="./images/menu.svg" alt="Blogs" /></a></td><td>' + formatNumber(blog.totalPosts) + '</td><td>' + formatNumber(halfYearCount) + '</td><td>' + getTimeToDate2(oldPost) + '</td><td>' + getTimeToDate2(newPost) + '</td><td>' + (googleResults[blog.blogName] === undefined ? "" : googleResults[blog.blogName]) + '</td><td title="' + owner + '">' + owner + '</td><td>' + ((country === "" && language === "") ? "" : (country + '/' + language)) + '</td><td>' + mu + '</td><td></td></tr>';
    }
    $('#table1 table').append(tr + '</tbody>');
    $('#table1 tbody tr td:nth-child(1)').click(function() {
      $(this).addClass('showBlogMenu');
      var name = $(this).parent().children()[0].innerText;
      var top = $(this).offset().top;
      var left = $(this).offset().left;
      blogMenu(name, top, left);
    });

    $('#table1 table').DataTable({
      "scrollY": '51vh',
      "scrollX": false,
      "iDisplayLength": 25,
      "columnDefs": [
        { type: 'date-dd-mmm-yyyy', targets: 3 },
        { type: 'date-dd-mmm-yyyy', targets: 4 }
      ]
    });
  }

  // 2nd Table
  function calTable2() {
    $('#table2').hide();
    $('#tableLoading').show();
    $('#table h2').text('Details: Most current post age');
    if (themeData.rows != undefined) {
      updateTable2($('#table2Filter1').val(), $('#table2Filter2').val(), $('#table2Filter3').val());
      console.log('themeDetails', themeData);
      if ($('.tableDiv').hasClass('card2')) {
        $('#table2').show();
        $('#table2 table').DataTable().search('').draw();
        $('#tableLoading').hide();
      }
    } else {
      $.ajax({
        url: '/themeDetails?version=' + currentVersion,
        success: function(result) {
          themeData = result;
          console.log('themeDetails', result);
          updateFilter2();
          updateTable2($('#table2Filter1').val(), $('#table2Filter2').val(), $('#table2Filter3').val());
          if ($('.tableDiv').hasClass('card2')) {
            $('#table2').show();
            $('#table2 table').DataTable().search('').draw();
            $('#tableLoading').hide();
          }
        },
        error: function(error) {
          themeData = {};
          console.error('themeDetails Error', error);
          $('#tableLoading').hide();
        }
      })
    }

    function updateFilter2() {
      var themeList = [];
      var versionList = [];
      for (i in themeData.rows) {
        var themes = themeData.rows[i].value.themeDetails;
        var blogName = themeData.rows[i].value.blogName;
        for (j in themes) {
          var theme = themes[j];
          if (themeList.indexOf(theme.themeName) === -1) {
            themeList.push(theme.themeName);
          }
          if (versionList.indexOf(theme.themeVersion) === -1) {
            versionList.push(theme.themeVersion);
          }
        }
      }
      themeList.sort();
      versionList.sort();
      for (i in themeList) {
        $('#table2Filter1').append('<option value=' + themeList[i] + '>' + themeList[i] + '</option>');
      }

      for (i in versionList) {
        $('#table2Filter2').append('<option value=' + versionList[i] + '>' + versionList[i] + '</option>');
      }
    }

  }

  function updateTable2(filterTheme, filterVersion, filterActive) {
    $('#table2 table').DataTable().destroy();
    $('#table2 table tbody').remove();
    var rImg = '<img src="./images/icon-green.png" class="right"><span class="yesorno"> Yes</span>';
    var wImg = '<img src="./images/icon-red.png" class="wrong"><span class="yesorno"> No</span>';
    var totalCount = 0;
    var standCount = 0;
    var currentCount = 0;
    var activeCount = 0;
    var bothCount = 0;
    var tr = '<tbody>';
    for (i in themeData.rows) {
      var themes = themeData.rows[i].value.themeDetails;
      var blogName = themeData.rows[i].value.blogName;
      for (j in themes) {
        var theme = themes[j];
        if (filterTheme !== 'all' && theme.themeName !== filterTheme) {
          continue;
        }
        if (filterVersion !== 'all' && theme.themeVersion !== filterVersion) {
          continue;
        }
        if (filterActive !== 'all' && theme.status !== filterActive) {
          continue;
        }
        totalCount++;
        var ifStardard = false;
        var ifCurrent = false;
        var ifActive = false;
        if (theme.themeName === 'ibmNorthstar' || theme.themeName === 'ibmNorthstarLST') {
          ifStardard = true;
          standCount++;
        }
        if (theme.themeVersion.substr(0, 3) === '1.6') {
          ifCurrent = true;
          currentCount++;
        }
        if (theme.status === 'active') {
          ifActive = true;
          activeCount++;
        }
        if (ifStardard && ifCurrent) {
          bothCount++;
        }
        tr += '<tr><td></td><td><span>' + blogName + '</span><a class="jumpLink"><img src="./images/menu.svg" alt="Blogs" /></a></td><td>' + theme.themeName + '</td><td>' + theme.themeVersion + '</td><td>' + (ifActive ? rImg : wImg) + '</td><td>' + (ifStardard ? rImg : wImg) + '</td><td>' + (ifCurrent ? rImg : wImg) + '</td><td>' + (ifStardard && ifCurrent ? rImg : wImg) + '</td></tr>';
      }
    }
    $('#table2 table').append(tr + '</tbody>');

    var total = '<tbody><tr><td></td><td>Total = ' + formatNumber(totalCount) + '</td><td></td><td></td><td>' + formatNumber(activeCount) + '</td><td>' + formatNumber(standCount) + '</td><td>' + formatNumber(currentCount) + '</td><td>' + formatNumber(bothCount) + '</td></tr><tr><td></td><td>% of overall total</td><td></td><td></td><td>' + getPercent(activeCount, totalCount) + '</td><td>' + getPercent(standCount, totalCount) + '</td><td>' + getPercent(currentCount, totalCount) + '</td><td>' + getPercent(bothCount, totalCount) + '</td></tr></tbody>';
    $('#table2 table').append(total);

    $('#table2 tbody tr td:nth-child(2)').click(function() {
      $(this).addClass('showBlogMenu');
      var name = $(this).parent().children()[1].innerText;
      var top = $(this).offset().top;
      var left = $(this).offset().left;
      blogMenu(name, top, left);
    });

    $('#table2 table').DataTable({
      "scrollY": '51vh',
      "scrollX": false,
      "iDisplayLength": 25,
      columnDefs: [{
        orderable: false,
        className: 'select-checkbox',
        targets: 0
      }],
      select: {
        style: 'multi+shift',
        selector: 'td:first-child'
      },
      order: [
        [1, 'asc']
      ]
    });
  }

  // 3th Table
  function calTable3() {
    $('#table3').hide();
    $('#tableLoading').show();
    $('#table h2').text('Details: Most current post age');
    if (blogs.rows != undefined) {
      updateTable3();
      console.log('dashBoard', blogs);
      if ($('.tableDiv').hasClass('card3')) {
        $('#table3').show();
        $('#table3 table').DataTable().search('').draw();
        $('#tableLoading').hide();
      }
    }

    function updateTable3() {
      $('#table3 table').DataTable().destroy();
      $('#table3 table tbody').remove();
      var tr = '<tbody>'
      var nowTime = new Date();
      var nowDate = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), 0, 0, 0);
      var disTime = nowDate.getTime();
      for (i in blogs.rows) {
        var blogName = blogs.rows[i].value.blogName;
        var posts = blogs.rows[i].value.postDate;
        var mostCurDate = '';
        for (var j = 0; j < posts.length; j++) {
          if (j === 0) {
            mostCurDate = posts[0];
          } else {
            if (getTimeToTime(mostCurDate) < getTimeToTime(posts[j])) {
              mostCurDate = posts[j];
            }
          };
        };
        var result = calTime(mostCurDate, disTime);
        tr += '<tr><td>' + blogName + '<a class="jumpLink"><img src="./images/menu.svg" alt="Blogs" /></a></td><td>' + formatNumber(result) + '</td></tr>';
      };
      $('#table3 table').append(tr + '</tbody>');
      $('#table3 tbody tr td:nth-child(1)').click(function() {
        $(this).addClass('showBlogMenu');
        var name = $(this).parent().children()[0].innerText;
        var top = $(this).offset().top;
        var left = $(this).offset().left;
        blogMenu(name, top, left);
      });

      $('#table3 table').DataTable({
        "scrollY": '51vh',
        "scrollX": false,
        "iDisplayLength": 25
      });
    }
  }

  // 4th Table
  function calTable4() {
    $('#table4').hide();
    $('#tableLoading').show();
    $('#table h2').text('Details: New posts');
    if (blogs.rows != undefined) {
      updateTable4();
      console.log('dashBoard', blogs);
      if ($('.tableDiv').hasClass('card4')) {
        $('#table4').show();
        $('#table4 table').DataTable().search('').draw();
        $('#tableLoading').hide();
      }
    }

    function updateTable4() {
      $('#table4 table').DataTable().destroy();
      $('#table4 table tbody').remove();
      var tr = '<tbody>'
      var total7 = 0;
      var total30 = 0;
      var total90 = 0;
      var totalyear = 0;
      var totalCount = 0;
      var nowTime = new Date();
      var nowDate = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), 0, 0, 0);
      var disTime = nowDate.getTime();
      for (i in blogs.rows) {
        var blogName = blogs.rows[i].value.blogName;
        var posts = blogs.rows[i].value.postDate;
        var count7 = 0;
        var count30 = 0;
        var count90 = 0;
        var countyear = 0;
        var counttotal = 0;
        for (j in posts) {
          var dayCount = calTime(posts[j], disTime);
          counttotal++;
          if (dayCount <= 7) {
            count7++;
          }
          if (dayCount <= 30) {
            count30++;
          }
          if (dayCount <= 90) {
            count90++;
          }
          if (dayCount <= 365) {
            countyear++;
          }
        };
        total7 += count7;
        total30 += count30;
        total90 += count90;
        totalyear += countyear;
        totalCount += counttotal;
        tr += '<tr><td>' + blogName + '<a class="jumpLink"><img src="./images/menu.svg" alt="Blogs" /></a></td><td>' + formatNumber(count7) + '</td><td>' + formatNumber(count30) + '</td><td>' + formatNumber(count90) + '</td><td>' + formatNumber(countyear) + '</td><td>' + formatNumber(counttotal) + '</td></tr>';
      };
      $('#table4 table').append(tr + '</tbody>');
      var total = '<tbody><tr><td>Total</td><td>' + formatNumber(total7) + '</td><td>' + formatNumber(total30) + '</td><td>' + formatNumber(total90) + '</td><td>' + formatNumber(totalyear) + '</td><td>' + formatNumber(totalCount) + '</td></tr></tbody>';
      $('#table4 table').append(total);

      $('#table4 tbody tr td:nth-child(1)').click(function() {
        $(this).addClass('showBlogMenu');
        var name = $(this).parent().children()[0].innerText;
        var top = $(this).offset().top;
        var left = $(this).offset().left;
        blogMenu(name, top, left);
      });

      $('#table4 table').DataTable({
        "iDisplayLength": 25,
        "scrollY": '51vh',
        "scrollX": false
      });
    }
  }

  // 5th Table
  function calTable5() {
    $('#table5').hide();
    $('#tableLoading').show();
    $('#table h2').text('Details: Plug-ins');
    if (pluginData.rows != undefined) {
      updateTable5($('#table5Filter1').val(), $('#table5Filter2').val(), $('#table5Filter3').val(), $('#table5Filter4').val(), $('#table5Filter5').val());
      console.log("pluginDetails", pluginData);
      if ($('.tableDiv').hasClass('card5')) {
        $('#table5').show();
        $('#table5 table').DataTable().search('').draw();
        $('#tableLoading').hide();
      }
    } else {
      $.ajax({
        url: '/pluginDetails?version=' + currentVersion,
        success: function(result) {
          $.ajax({
            url: '/plugins?version=' + currentVersion,
            success: function(statusResult) {
              pluginData = result;
              var status = {};
              for (var i in statusResult.rows) {
                var st = statusResult.rows[i];
                status[st.id] = st.value.status;
              }
              for (var i in pluginData.rows) {
                for (var j in pluginData.rows[i].value.pluginDetails) {
                  var plugin = pluginData.rows[i].value.pluginDetails[j];
                  plugin['active'] = plugin.status;
                  plugin.status = status[plugin.pluginName];
                }
              }
              console.log("status", status);
              console.log("pluginDetails", pluginData);
              updateFilter5();
              updateTable5($('#table5Filter1').val(), $('#table5Filter2').val(), $('#table5Filter3').val(), $('#table5Filter4').val(), $('#table5Filter5').val());
              if ($('.tableDiv').hasClass('card5')) {
                $('#table5').show();
                $('#table5 table').DataTable().search('').draw();
                $('#tableLoading').hide();
              }
            },
            error: function(error) {
              pluginData = {};
              console.log("pluginStatus Error", error);
            }
          })
        },
        error: function(error) {
          pluginData = {};
          console.log("pluginDetails Error", error);
        }
      })
    }



    function updateFilter5() {
      var pluginList = [];
      var blogList = [];
      var statusList = [];
      for (i in pluginData.rows) {
        var plugins = pluginData.rows[i].value.pluginDetails;
        var blogName = pluginData.rows[i].value.blogName;
        if (blogList.indexOf(blogName) === -1) {
          blogList.push(blogName);
        }
        for (j in plugins) {
          var plugin = plugins[j];
          if (pluginList.indexOf(plugin.pluginName) === -1) {
            pluginList.push(plugin.pluginName);
          }
          if (plugin.status !== undefined && statusList.indexOf(plugin.status) === -1) {
            statusList.push(plugin.status);
          }
        }
      }
      pluginList.sort();
      blogList.sort();
      statusList.sort();
      for (var i in pluginList) {
        $('#table5Filter1').append('<option value="' + pluginList[i] + '">' + pluginList[i] + '</option>');
      }

      for (var i in blogList) {
        $('#table5Filter2').append('<option value="' + blogList[i] + '">' + blogList[i] + '</option>');
      }
      for (var i in statusList) {
        var str = '<option value="' + statusList[i] + '">' + statusList[i] + '</option>';
        $('#table5Filter4').append(str);
      }
    }
  }

  function updateTable5(filterPlugin, filterBlog, filterActive, filterStatus, filterApproved) {
    console.log(filterPlugin, filterBlog, filterActive, filterStatus, filterApproved);
    $('#table5 table').DataTable().destroy();
    $('#table5 table tbody').remove();
    var tr = '<tbody>';
    var activeCount = 0;
    var approvCount = 0;
    var updateCount = 0;
    var totalCount = 0;
    var rImg = '<img src="./images/icon-green.png" class="right"><span class="yesorno"> Yes</span>';
    var wImg = '<img src="./images/icon-red.png" class="wrong"><span class="yesorno"> No</span>';
    var isActived = false;
    var isApproved = false;
    var isUpdated = false;
    var updateImg = wImg;
    for (i in pluginData.rows) {
      var blogName = pluginData.rows[i].value.blogName;
      var plugins = pluginData.rows[i].value.pluginDetails;
      if (filterBlog !== 'all' && blogName !== filterBlog) {
        continue;
      }
      for (j in plugins) {
        var plugin = plugins[j];
        if (filterPlugin !== 'all' && plugin.pluginName !== filterPlugin) {
          continue;
        }
        if (filterActive !== 'all' && plugin.active !== filterActive) {
          continue;
        }
        if (filterStatus !== 'all' && plugin.status !== filterStatus) {
          continue;
        }
        if (filterApproved === 'approved' && plugin.status !== 'Approved' && plugin.status !== 'Standard') {
          continue;
        }
        if (filterApproved === 'unapproved' && (plugin.status === 'Approved' || plugin.status === 'Standard')) {
          continue;
        }
        totalCount++;
        isActived = false;
        isUpdated = false;
        isApproved = false;
        if (plugin.active === 'active') {
          activeCount++;
          isActived = true;
        }
        if (plugin.status === 'Approved' || plugin.status === 'Standard') {
          approvCount++;
          isApproved = true;
        }
        if (plugin.update === 'available') {
          updateCount++;
          isUpdated = true;
        }
        tr += '<tr><td>' + plugin.pluginName + '</td><td>' + blogName + '</td><td>' + plugin.pluginVersion + '</td><td>' + (isActived ? rImg : wImg) + '</td><td>' + plugin.status + '</td><td>' + (isApproved ? rImg : wImg) + '</td><td>' + (isUpdated ? rImg : wImg) + '</td></tr>';
      };
    }
    $('#table5 table').append(tr + '</tbody>');
    var total = '<tbody><tr><td>Total = ' + formatNumber(totalCount) + '</td><td></td><td></td><td>' + formatNumber(activeCount) + '</td><td></td><td>' + formatNumber(approvCount) + '</td><td>' + formatNumber(updateCount) + '</td></tr><tr><td>% of overall total</td><td></td><td></td><td>' + getPercent(activeCount, totalCount) + '</td><td></td><td>' + getPercent(approvCount, totalCount) + '</td><td>' + getPercent(updateCount, totalCount) + '</td></tr></tbody>';
    $('#table5 table').append(total);
    $('#table5 table').DataTable({
      "iDisplayLength": 25,
      "scrollY": '51vh',
      "scrollX": false
    });
  }

  // 6th Table
  function calTable6() {
    $('#table6').hide();
    $('#tableLoading').show();
    $('#table h2').text('Details: Users');
    if (userData.rows != undefined) {
      updateTable6();
      console.log("userDetails", userData);
      if ($('.tableDiv').hasClass('card6')) {
        $('#table6').show();
        $('#table6 table').DataTable().search('').draw();
        $('#tableLoading').hide();
      }
    } else {
      $.ajax({
        url: '/userDetails?version=' + currentVersion,
        success: function(result) {
          userData = result;
          updateTable6();
          console.log("userDetails", userData);
          if ($('.tableDiv').hasClass('card6')) {
            $('#table6').show();
            $('#table6 table').DataTable().search('').draw();
            $('#tableLoading').hide();
          }
        },
        error: function(error) {
          userData = [];
          console.error("userDetails Error", error);
        }
      })
    }

    function updateTable6() {
      $('#table6 table').DataTable().destroy();
      $('#table6 table tbody').remove();
      var tr = '<tbody>';
      var totalCount = 0;
      var authorCountAll = 0;
      var subCountAll = 0;
      var conCountAll = 0;
      var siteCountAll = 0;
      var adminCountAll = 0;
      for (i in userData.rows) {
        var blog = userData.rows[i].value.usersDetials;
        var blogName = userData.rows[i].value.blogName;
        var authorCount = 0;
        var subCount = 0;
        var conCount = 0;
        var siteCount = 0;
        var adminCount = 0;
        for (j in blog) {
          var user = blog[j];
          totalCount++;
          if (user.usersRole === 'site_owner') {
            siteCount++;
          } else if (user.usersRole === 'administrator') {
            adminCount++;
          } else if (user.usersRole === 'author') {
            authorCount++;
          } else if (user.usersRole === 'editor') {
            conCount++;
          } else if (user.usersRole === 'subscriber') {
            subCount++;
          }
        };
        authorCountAll += authorCount;
        subCountAll += subCount;
        conCountAll += conCount;
        siteCountAll += siteCount;
        adminCountAll += adminCount;
        tr += '<tr><td></td><td><span>' + blogName + '</span><a class="jumpLink"><img src="./images/menu.svg" alt="Blogs" /></a></td><td>' + formatNumber(authorCount) + '</td><td>' + formatNumber(subCount) + '</td><td>' + formatNumber(conCount) + '</td><td>' + formatNumber(siteCount) + '</td><td>' + formatNumber(adminCount) + '</td></tr>';
      }
      $('#table6 table').append(tr + '</tbody>');
      var total = '<tbody><tr><td></td><td>Total = ' + formatNumber(totalCount) + '</td><td>' + formatNumber(authorCountAll) + '</td><td>' + formatNumber(subCountAll) + '</td><td>' + formatNumber(conCountAll) + '</td><td>' + formatNumber(siteCountAll) + '</td><td>' + formatNumber(adminCountAll) + '</td></tr></tbody>';
      $('#table6 table').append(total);
      $('#table6 tbody tr td:nth-child(2)').click(function() {
        $(this).addClass('showBlogMenu');
        var name = $(this).parent().children()[0].innerText;
        var top = $(this).offset().top;
        var left = $(this).offset().left;
        blogMenu(name, top, left);
      });
      $('#table6 table').DataTable({
        "iDisplayLength": 25,
        "scrollY": '51vh',
        "scrollX": false,
      });
    }
  }
  // 7th Table
  function calTable7() {
    $('#table7').hide();
    $('#tableLoading').show();
    $('#table h2').text('Details: Blogs');
    if (pageData.rows != undefined) {
      updateTable7($('#table7Filter1').val(), $('#table7Filter2').val(), $('#table7Filter3').val());
      console.log('tableDetails', pageData);
      if ($('.tableDiv').hasClass('card7')) {
        $('#table7').show();
        $('#table7 table').DataTable().search('').draw();
        $('#tableLoading').hide();
      }
    } else {
      $.ajax({
        url: '/pageDetails?version=' + currentVersion,
        success: function(result) {
          pageData = result;
          updateFilter7();
          updateTable7($('#table7Filter1').val(), $('#table7Filter2').val(), $('#table7Filter3').val());
          if ($('.tableDiv').hasClass('card7')) {
            $('#table7').show();
            $('#table7 table').DataTable().search('').draw();
            $('#tableLoading').hide();
          }
          console.log('tableDetails', pageData);
        },
        error: function(error) {
          pageData = [];
          console.error('tableDetails Error', error);
        }
      })
    }

    function updateFilter7() {
      var pageList = [];
      var blogList = [];
      var statusList = [];
      for (i in pageData.rows) {
        var pages = pageData.rows[i].value.pageDetails;
        var blogName = pageData.rows[i].value.blogName;
        if (blogList.indexOf(blogName) === -1) {
          blogList.push(blogName)
        }
        for (j in pages) {
          var page = pages[j];
          if (pageList.indexOf(page.postName) === -1) {
            pageList.push(page.postName)
          }
          if (statusList.indexOf(page.postStatus) === -1) {
            statusList.push(page.postStatus)
          }
        };
      }
      pageList.sort();
      blogList.sort();
      statusList.sort();
      for (i in pageList) {
        $('#table7Filter1').append('<option value=' + pageList[i] + '>' + pageList[i] + '</option>');
      }

      for (i in blogList) {
        $('#table7Filter2').append('<option value=' + blogList[i] + '>' + blogList[i] + '</option>');
      }

      for (i in statusList) {
        $('#table7Filter3').append('<option value=' + statusList[i] + '>' + statusList[i] + '</option>');
      }
    }
  }

  function updateTable7(filterPage, filterBlog, filterStatus) {
    $('#table7 table').DataTable().destroy();
    $('#table7 table tbody').remove();
    var tr = '<tbody>';
    for (i in pageData.rows) {
      var pages = pageData.rows[i].value.pageDetails;
      var blogName = pageData.rows[i].value.blogName;
      if (filterBlog !== 'all' && filterBlog !== blogName) {
        continue;
      }
      for (j in pages) {
        var page = pages[j];
        if (filterPage !== 'all' && filterPage !== page.postName) {
          continue;
        }
        if (filterStatus !== 'all' && filterStatus !== page.postStatus) {
          continue;
        }
        tr += '<tr><td>' + page.postName + '</td><td>' + blogName + '</td><td>' + page.postStatus + '</td><td></td><td></td></tr>';
      };
    }
    $('#table7 table').append(tr + '</tbody>');
    $('#table7 table').DataTable({
      "iDisplayLength": 25,
      "scrollY": '51vh',
      "scrollX": false
    });
  }

  function reset() {
    $('#loadingMockupSpinner div.ibm-spinner').css('animation', startStyle);
    $('#loadingText').text('LOADING');
    $('#loadingMockupSpinner p.ibm-ind-link').hide();
    $('#loadingMockupSpinner').show();
    blogs = [];
    blogData = {};
    themeData = {};
    pluginData = {};
    userData = {};
    pageData = {};
    currentVersion = 'prod';
    googleResults = null;
    $('#currentTime span:nth-child(2)').text('');
    $('#card1 .cardValue').text('');
    $('#card2 .cardValue').text('');
    $('#card3 .cardValue').text('');
    $('#card4 .cardValue').text('');
    $('#card5 .cardValue').text('');
    $('#card6 .cardValue').text('');
    $('#card7 .cardValue').text('');
    $('.myTable').removeClass('myTable');
    $('#main').removeClass('showTable');
    $('#table').hide();
  }

  function dashBoardRun() {
    $.ajax({
      url: "/dashBoard?version=" + currentVersion,
      success: function(result) {
        console.log('dashBoard', result);
        blogs = result;
        loadSuccess();
      },
      error: function(err) {
        console.error('dashBoard', err);
        blogs = 'error';
        loadFailed();
      }
    });
    if (verEnv === 'dev') {
      var result = [
        ["/?s=Watson&lnk=mhsrch&v=18&en=utf&lang=en&cc=us", "1"],
        ["/?s=digital", "1"],
        ["/?s=digital+certificate+authority&lnk=mhsrch&v=18&en=utf&lang=en&cc=us", "1"],
        ["/analytics-zone/", "2738"],
        ["/azami/", "204"],
        ["/ba-support-link/", "1511"],
        ["/base-and-solve/", "1156"],
        ["/beyond-the-wallet-entering-a-world-of-frictionless-commerce/", "12"],
        ["/blog-owner-support/", "24"],
        ["/bluemix/", "34143"],
        ["/brexit/", "258"],
        ["/brki/", "1172"],
        ["/business-insight/", "65"],
        ["/business-partner-blog/", "239"],
        ["/business-transformation-news/", "31"],
        ["/citizen-ibm/", "4091"],
        ["/client-voices/", "30"],
        ["/cloud-and-information-management/", "1"],
        ["/cloud-computing/", "42445"],
        ["/commerce/", "47485"],
        ["/criqueliere/", "21"],
        ["/cross-selling/", "113"],
        ["/data-protection-retention/", "38"],
        ["/digital-devops/", "1266"],
        ["/digital-marketing/", "1"],
        ["/dmexco-gave-lots-of-ingredients-but-whats-the-digital-marketing-recipe/", "1"],
        ["/ecm/", "4968"],
        ["/emerging-technology/", "1590"],
        ["/energy-utilities-solution-architects/", "25"],
        ["/engagement/", "112"],
        ["/fulhamfc/", "45"],
        ["/game-changers/", "136"],
        ["/gbs-fi-content/", "45"],
        ["/how-emotional-engagement-can-be-used-to-increase-customer-loyalty/", "1"],
        ["/ianlsblog/", "17"],
        ["/ibm-social-software/", "208"],
        ["/ibm-training/", "3190"],
        ["/insights-on-business/", "19731"],
        ["/internet-of-things/", "29054"],
        ["/ip-management/", "54"],
        ["/jikimari/", "18"],
        ["/kamoshi/", "275"],
        ["/lacafe/", "6"],
        ["/latinos/", "33385"],
        ["/linux-at-ibm/", "24"],
        ["/nezcc/", "41"],
        ["/nordic-msp/", "818"],
        ["/pachi/", "2789"],
        ["/peppol-by-ibm/", "371"],
        ["/performance/", "67"],
        ["/pro-vision/", "3299"],
        ["/psirt/", "10880"],
        ["/robertoa/", "2756"],
        ["/sejasocial/", "24"],
        ["/smarter-workforce/", "4544"],
        ["/sweeden/", "1588"],
        ["/systems", "6"],
        ["/systems-MU/", "104"],
        ["/systems-nordic/", "397"],
        ["/systems/", "40538"],
        ["/tech-content/", "153"],
        ["/think-leaders", "1"],
        ["/think-leaders/", "5382"],
        ["/think/", "1186"],
        ["/tokyo-soc/", "1078"],
        ["/transformacion/", "102"],
        ["/watson-health/", "1613"],
        ["/watson-hub/", "95"],
        ["/watson/", "3"],
        ["/websphere-commerce/", "198"]
      ];
      googleResults = {};
      for (i in result) {
        var value = result[i][0].split('/');
        var key = '';
        var num = '';
        if (value.length === 3) {
          key = value[1];
          num = result[i][1];
          googleResults[key] = formatNumber(num);
        }
      };
    } else {
      $.ajax({
        url: "/googleAnalytics?version=" + currentVersion,
        success: function(result) {
          console.log('googleAnalytics', result);
          googleResults = {};
          for (i in result) {
            var value = result[i][0].split('/');
            var key = '';
            var num = '';
            if (value.length === 3) {
              key = value[1];
              num = result[i][1];
              googleResults[key] = formatNumber(num);
            }
          };
          loadSuccess();
        },
        error: function(err) {
          console.error('googleAnalytics', err);
          googleResults = 'error';
          loadFailed();
        }
      });
    }
  }

  function loadSuccess() {
    if (googleResults == 'error' || blogs == 'error') {
      loadFailed();
    } else if (googleResults != null && blogs.length != 0) {
      calBlogCount();
      calStaThe();
      calPlugin();
      calCurDay();
      calPost();
      calAuthor();
      calPages();
      $('#loadingMockupSpinner').hide();
    }
  }

  function loadFailed() {
    console.log('Load Failed! Please retry!');
    $('#loadingMockupSpinner div.ibm-spinner').css('animation', stopStyle);
    $('#loadingText').text('ERROR');
    $('#loadingMockupSpinner p.ibm-ind-link').show();
  }

  function blogMenu(name, top, left) {
    if ($('#switchVersion').val() === 'prod') {
      var url = 'https://admin.blogs.prd.ibm.event.ibm.com/blogs/' + name + '/wp-admin/';
    } else {
      var url = 'https://admin.blogs.pre.ibm.event.ibm.com/blogs/' + name + '/wp-admin/';
    }
    $('#moreInfoDiv p:nth-child(1) a').attr('href', 'https://www.ibm.com/blogs/' + name + '/');
    $('#moreInfoDiv p:nth-child(2) a').attr('href', url);
    $('#moreInfoDiv p:nth-child(3) a').attr('blogname', name);
    $('#moreInfoDiv').css({
      top: top + 5,
      left: left
    });
    $('#moreInfoDiv').show();
  }

  function resetTable1Filters() {
    $('#table1Filter1').val('all').change();
    $('#table1Filter2').val('all').change();
    $('#table1Filter3').val('all').change();
  }

  function resetTable2Filters() {
    $('#table2Filter1').val('all').change();
    $('#table2Filter2').val('all').change();
    $('#table2Filter3').val('active').change();
  }

  function resetTable5Filters() {
    $('#table5Filter1').val('all').change();
    $('#table5Filter2').val('all').change();
    $('#table5Filter3').val('active').change();
    $('#table5Filter4').val('all').change();
    $('#table5Filter5').val('approved').change();
  }

  function resetTable7Filters() {
    $('#table7Filter1').val('all').change();
    $('#table7Filter2').val('all').change();
    $('#table7Filter3').val('all').change();
    $('#table7Filter4').val('all').change();
  }


  function calTime(date, disTime) {
    var dateC = getTimeToDate(date);
    if (dateC) {
      var dayCount = (disTime - dateC) / (1000 * 60 * 60 * 24);
      return dayCount;
    } else {
      return -1;
    }
  }

  function getTimeToDate(date) {
    var dateC = date.match(/^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    if (dateC) {
      var dateC = new Date(parseInt(dateC[1], 10),
        parseInt(dateC[2], 10) - 1,
        parseInt(dateC[3], 10), 0, 0, 0);
      return dateC.getTime();
    } else {
      return undefined;
    }
  }

  function getTimeToTime(date) {
    var dateC = date.match(/^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    if (dateC) {
      var dateC = new Date(parseInt(dateC[1], 10),
        parseInt(dateC[2], 10) - 1,
        parseInt(dateC[3], 10),
        parseInt(dateC[4], 10),
        parseInt(dateC[5], 10),
        parseInt(dateC[6], 10));
      return dateC.getTime();
    } else {
      return undefined;
    }
  }

  function getTimeToDate2(num) {
    if (!num) {
      return '';
    } else {
      var date = new Date(num);
      var year = date.getFullYear();
      var monthList = new Array(12);
      monthList[0] = "Jan";
      monthList[1] = "Feb";
      monthList[2] = "Mar";
      monthList[3] = "Apr";
      monthList[4] = "May";
      monthList[5] = "Jun";
      monthList[6] = "Jul";
      monthList[7] = "Aug";
      monthList[8] = "Sep";
      monthList[9] = "Oct";
      monthList[10] = "Nov";
      monthList[11] = "Dec";
      var month = monthList[date.getMonth()];
      var day = date.getDate();
      var result = day + ' ' + month + ' ' + year; // dd mm yyyy
      return result;
    }
  }

  function getPercent(num1, num2) {
    var result = (num1 / num2) * 100 + '';
    if (result.indexOf('.') !== -1) {
      result = result.substr(0, result.indexOf('.'));
    }
    if (result === '') {
      return '0%';
    } else {
      return result + '%';
    }
  }

  function getPercent2(num1, num2) {
    var result = (num1 / num2) + '';
    if (result.indexOf('.') !== -1) {
      result = result.substr(0, result.indexOf('.'));
    }
    if (result === '') {
      return '0';
    } else {
      return result;
    }
  }

  function formatNumber(num) {
    var result = '';
    if (typeof(num) === 'number') {
      num += '';
    }
    if (num.length >= 4 && num.length < 7) {
      result = num.slice(0, num.length - 3) + ',' + num.slice(num.length - 3);
    } else if (num.length >= 7 && num.length < 10) {
      result = num.slice(0, num.length - 6) + ',' + num.slice(num.length - 6, num.length - 3) + ',' + num.slice(num.length - 3);
    } else if (num.length >= 10) {
      result = num.slice(0, num.length - 9) + ',' + num.slice(num.length - 9, num.length - 6) + ',' + num.slice(num.length - 6, num.length - 3) + ',' + num.slice(num.length - 3);
    } else {
      result = num;
    }
    return result;
  }

});
