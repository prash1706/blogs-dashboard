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
var clipboard = new Clipboard('.copyAddressBtn');

clipboard.on('success', function(e) {
  $('.copyAddressBtn').text('Copied!');
});

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

  $('a.showUserDetailOverlay').click(function() {
    IBMCore.common.widget.overlay.show('userDetailOverlay');
  })

  $('.table1Filter').on("change", function() {
    if (blogData.rows != undefined) {
      updateTable1($('#table1Filter1').val(), $('#table1Filter2').val());
    }
  });

  $('.table2Filter').on("change", function() {
    if (themeData.rows != undefined) {
      updateTable2();
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

  $('#emailUsersPopup').hover(function() {}, function() {
    $('#emailUsersPopup').hide();
  })

  $('input:radio[name="allorspe"]').change(function() {
    if ($('#speRolesPopup').prop('checked')) {
      $('#speRolesPopupGroup').show();
    } else {
      $('#speRolesPopupGroup').hide();
    }
  });

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

  $('#sendUserEmailBtn').click(function() {
    var addressStr = $('#copyUserEmailBtn').attr('data-clipboard-text');
    window.open('mailto:' + addressStr);
  })

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
      standThe = standThe + blogs.rows[i].value.standThe;
      activeCount = activeCount + blogs.rows[i].value.activeCount;
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
      var result = calTime(blogs.rows[i].value.mostCurDate, disTime);
      if (result != -1) {
        disDayList.push(result);
      }
    };
    var totalDay = 0;
    for (i in disDayList) {
      totalDay += disDayList[i];
    }
    var result = totalDay / disDayList.length + '';
    if (result.indexOf('.') != -1) {
      result = result.substr(0, result.indexOf('.'))
    }
    $('#card3 .cardValue').text(result + ' days');
  }

  // 4th Card
  function calPost() {
    var count = 0;
    for (i in blogs.rows) {
      count = count + blogs.rows[i].value.count;
    };

    $('#card4 .cardValue').text(count + ' posts');
  }

  // 5th Card
  function calPlugin() {
    var totalCount = 0;
    var activeCount = 0;
    for (i in blogs.rows) {
      totalCount = totalCount + blogs.rows[i].value.pluginTotalCount;
      activeCount = activeCount + blogs.rows[i].value.pluginActiveCount;
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
      var owner = blog.owner == undefined ? '' : blog.owner;
      var country = blog.country == undefined ? '' : blog.country;
      var language = blog.language == undefined ? '' : blog.language;
      var mu = blog.mu == undefined ? '' : blog.mu;
      var oldPost = getTimeToTime(blog.oldPost);
      var newPost = getTimeToTime(blog.newPost);
      tr += '<tr><td><span>' + blog.blogName + '</span><a class="jumpLink"><img src="./images/menu.svg" alt="Blogs" /></a></td><td>' + formatNumber(blog.totalPosts) + '</td><td>' + formatNumber(blog.halfYearCount) + '</td><td>' + getTimeToDate2(oldPost) + '</td><td>' + getTimeToDate2(newPost) + '</td><td>' + (googleResults[blog.blogName] === undefined ? "" : googleResults[blog.blogName]) + '</td><td title="' + owner + '">' + owner + '</td><td>' + ((country === "" && language === "") ? "" : (country + '/' + language)) + '</td><td>' + mu + '</td><td></td></tr>';
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
    $('#table h2').text('Details: Themes');
    if (themeData.rows != undefined) {
      updateTable2();
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
          updateTable2();
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
      versionList.sort(function(a, b) {
        return compareVersion(a, b)
      });
      for (i in themeList) {
        $('#table2Filter1').append('<option value=' + themeList[i] + '>' + themeList[i] + '</option>');
      }

      for (i in versionList) {
        $('#table2Filter2').append('<option value=' + versionList[i] + '>' + versionList[i] + '</option>');
      }
    }
  }

  function updateTable2() {
    var OpTheme = $('#table2FilterOp1').val();
    var filterTheme = $('#table2Filter1').val();
    var OpVersion = $('#table2FilterOp2').val();
    var filterVersion = $('#table2Filter2').val();
    var filterActive = $('#table2Filter3').val();

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
        if (OpTheme == 'equal' && filterTheme !== 'all' && theme.themeName !== filterTheme) {
          continue;
        } else if (OpTheme != 'equal' && filterTheme == 'all') {
          continue;
        } else if (OpTheme != 'equal' && filterTheme != 'all' && theme.themeName == filterTheme) {
          continue;
        }

        if (OpVersion == 'equal' && filterVersion !== 'all' && theme.themeVersion !== filterVersion) {
          continue;
        } else if (OpVersion != 'equal' && filterVersion == 'all') {
          continue;
        } else if (OpVersion == 'more' && filterVersion !== 'all' && compareVersion(theme.themeVersion, filterVersion) == -1) {
          continue;
        } else if (OpVersion == 'less' && filterVersion !== 'all' && compareVersion(theme.themeVersion, filterVersion) == 1) {
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

    var table = $('#table2 table').DataTable({
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

    table.on('select', function(e, dt, type, indexes) {
      selectRows();
    }).on('deselect', function(e, dt, type, indexes) {
      selectRows();
    });

    $('#table2 .emailUsers button').click(function() {
      if (!$(this).hasClass('disabled')) {
        var top = $(this).offset().top;
        var left = $(this).offset().left;
        $('#emailUsersPopup').css({
          top: top + 18,
          left: left - 10
        });
        $('#emailUsersPopup').show();
      }
    })

    var blogNames = [];
    var addressStr = '';

    function selectRows() {
      resetEmailUsersPopup();
      blogNames = [];
      addressStr = '';
      var totalCount = 0;
      var authorCount = 0;
      var subCount = 0;
      var conCount = 0;
      var siteCount = 0;
      var adminCount = 0;
      if (table.rows({ selected: false }).count() == 0) {
        $('#table2 table input.selectAll').prop('checked', true);
      } else {
        $('#table2 table input.selectAll').prop('checked', false);
      }

      if (table.rows({ selected: true }).count() == 0) {
        $('#table2 p.emailUsers button').addClass('disabled');
      } else {
        $('#table2 p.emailUsers button').removeClass('disabled');
      }

      for (var i in table.rows({ selected: true }).data().toArray()) {
        var rows = table.rows({ selected: true }).data().toArray()[i];
        var blogName = rows[1].substr(6, rows[1].indexOf('</span>') - 6);
        blogNames.push(blogName)
      }

      if (blogNames.length > 0) {
        for (var i in userData.rows) {
          var blog = userData.rows[i];
          if (blogNames.indexOf(blog.id) == -1) {
            continue;
          }
          totalCount += blog.value.totalCount;
          authorCount += blog.value.authorCount;
          conCount += blog.value.conCount;
          siteCount += blog.value.siteCount;
          subCount += blog.value.subCount;
          adminCount += blog.value.adminCount;
        }
      }

      $("#emailUsersPopup label[for='allRolesPopup']").text("All Roles (" + totalCount + ')');
      $("#emailUsersPopup label[for='authorRolePopup']").text("Authors (" + authorCount + ')');
      $("#emailUsersPopup label[for='subRolePopup']").text("Subscribers (" + subCount + ')');
      $("#emailUsersPopup label[for='conRolePopup']").text("Contributors (" + conCount + ')');
      $("#emailUsersPopup label[for='siteRolePopup']").text("Site Owners (" + siteCount + ')');
      $("#emailUsersPopup label[for='adminRolePopup']").text("Administrators (" + adminCount + ')');

      $("#emailUsersPopup input#authorRolePopup").prop('disabled', (authorCount !== 0) ? false : true);
      $("#emailUsersPopup input#subRolePopup").prop('disabled', (subCount !== 0) ? false : true);
      $("#emailUsersPopup input#conRolePopup").prop('disabled', (conCount !== 0) ? false : true);
      $("#emailUsersPopup input#siteRolePopup").prop('disabled', (siteCount !== 0) ? false : true);
      $("#emailUsersPopup input#adminRolePopup").prop('disabled', (adminCount !== 0) ? false : true);

    }

    $('#emailUsersPopup input[name="allorspe"]').change(function() {
      if ($(this).val() === 'all') {
        $('#sendEmailBtn').prop('disabled', false);
        $('#copyEmailBtn').removeClass('disabled');
      } else if ($('#emailUsersPopup input[name="typeInSpe"]:checked').val() == undefined) {
        $('#sendEmailBtn').prop('disabled', true);
        $('#copyEmailBtn').addClass('disabled');
      } else {
        $('#sendEmailBtn').prop('disabled', false);
        $('#copyEmailBtn').removeClass('disabled');
      }
      calEmails();
    })

    $('#emailUsersPopup input[name="typeInSpe"]').change(function() {
      if ($('#emailUsersPopup input[name="typeInSpe"]:checked').val() == undefined) {
        $('#sendEmailBtn').prop('disabled', true);
        $('#copyEmailBtn').addClass('disabled');
      } else {
        $('#sendEmailBtn').prop('disabled', false);
        $('#copyEmailBtn').removeClass('disabled');
      }
      calEmails();
    })


    $('#sendEmailBtn').click(function() {
      console.log('addressStr', addressStr)
      window.open('mailto:' + addressStr);
    });

    $('#table2 .emailUsers button').click(function() {
      if (!$(this).hasClass('disabled')) {
        $('.copyAddressBtn').text('Copy addresses');
        if (addressStr === '') {
          calEmails();
        }
      }
    })

    $('#table2 table input.selectAll').on('click', function() {
      if ($(this).prop('checked')) {
        table.rows().select();
      } else {
        table.rows().deselect();
      }
    });

    function calEmails() {
      addressStr = '';
      $('.copyAddressBtn').text('Copy addresses');
      var emails = [];
      if ($('#emailUsersPopup input#allRolesPopup').prop('checked')) {
        for (var i in userData.rows) {
          var blog = userData.rows[i]
          if (blogNames.indexOf(blog.id) == -1) {
            continue;
          }
          var users = blog.value.users;
          for (var j in users) {
            var addr = users[j].userEmail;
            if (emails.indexOf(addr) !== -1 && emails.length != 0) {
              continue;
            }
            emails.push(addr);
          }
        }
      } else {
        var roleTypes = [];
        if ($('#emailUsersPopup input#authorRolePopup').prop('checked')) {
          roleTypes.push('author')
        }
        if ($('#emailUsersPopup input#subRolePopup').prop('checked')) {
          roleTypes.push('subscriber')
        }
        if ($('#emailUsersPopup input#conRolePopup').prop('checked')) {
          roleTypes.push('editor')
        }
        if ($('#emailUsersPopup input#siteRolePopup').prop('checked')) {
          roleTypes.push('site_owner')
        }
        if ($('#emailUsersPopup input#adminRolePopup').prop('checked')) {
          roleTypes.push('administrator')
        }
        for (var i in userData.rows) {
          var blog = userData.rows[i]
          if (blogNames.indexOf(blog.id) == -1) {
            continue;
          }
          var users = blog.value.users;
          for (var j in users) {
            var user = users[j]
            if (roleTypes.indexOf(user.roles) === -1) {
              continue
            }
            if (emails.indexOf(user.userEmail) !== -1 && emails.length != 0) {
              continue;
            }
            emails.push(user.userEmail);
          }
        }
      }
      console.log('emails', emails.length);
      addressStr = emails.join(', ');
      $('#copyEmailBtn').attr('data-clipboard-text', addressStr);
    }
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
        var result = calTime(blogs.rows[i].value.mostCurDate, disTime);
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
        var count7 = 0;
        var count30 = 0;
        var count90 = 0;
        var countyear = 0;
        var counttotal = 0;

        count7 = blogs.rows[i].value.postValue.count7;
        count30 = blogs.rows[i].value.postValue.count30;
        count90 = blogs.rows[i].value.postValue.count90;
        countyear = blogs.rows[i].value.postValue.countyear;
        counttotal = blogs.rows[i].value.postValue.counttotal;

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
        var blogName = userData.rows[i].value.blogName;
        var blog = userData.rows[i].value;
        totalCount += blog.totalCount;
        var authorCount = blog.authorCount;
        var subCount = blog.subCount;
        var conCount = blog.conCount;
        var siteCount = blog.siteCount;
        var adminCount = blog.adminCount;

        authorCountAll += authorCount;
        subCountAll += subCount;
        conCountAll += conCount;
        siteCountAll += siteCount;
        adminCountAll += adminCount;
        tr += '<tr><td></td><td><span>' + blogName + '</span><a class="jumpLink"><img src="./images/menu.svg" alt="Blogs" /></a></td><td><a class="showUserDetailOverlay" href="javascript:">' + formatNumber(authorCount) + '</a></td><td><a class="showUserDetailOverlay" href="javascript:">' + formatNumber(subCount) + '</a></td><td><a class="showUserDetailOverlay" href="javascript:">' + formatNumber(conCount) + '</a></td><td><a class="showUserDetailOverlay" href="javascript:">' + formatNumber(siteCount) + '</a></td><td><a class="showUserDetailOverlay" href="javascript:">' + formatNumber(adminCount) + '</a></td></tr>';
      }
      $('#table6 table').append(tr + '</tbody>');
      var total = '<tbody><tr><td></td><td>Total = ' + formatNumber(totalCount) + '</td><td>' + formatNumber(authorCountAll) + '</td><td>' + formatNumber(subCountAll) + '</td><td>' + formatNumber(conCountAll) + '</td><td>' + formatNumber(siteCountAll) + '</td><td>' + formatNumber(adminCountAll) + '</td></tr></tbody>';
      $('#table6 table').append(total);
      $('#table6 tbody tr td:nth-child(2)').click(function() {
        $(this).addClass('showBlogMenu');
        var name = $(this).parent().children()[1].innerText;
        var top = $(this).offset().top;
        var left = $(this).offset().left;
        blogMenu(name, top, left);
      });

      $('a.showUserDetailOverlay').click(function() {
        var tr = $(this).parent().parent();
        var index = tr.children().index($(this).parent());
        console.log('index', index)
        if (index < 2) {
          return;
        }
        var role = '';
        switch (index) {
          case 2:
            role = 'author';
            break;
          case 3:
            role = 'subscriber';
            break;
          case 4:
            role = 'editor';
            break;
          case 5:
            role = 'site_owner';
            break;
          case 6:
            role = 'administrator';
            break;
          default:
            role = '';
            break;
        }
        var blogName = tr.children('td:nth-child(2)').text();
        var users = [];
        var userResult = [];
        var content = $('#userDetailOverlay div:nth-child(2)');
        content.html('');
        for (var i in userData.rows) {
          if (userData.rows[i].id == blogName) {
            users = userData.rows[i].value.users;
            break;
          }
        }
        for (var j in users) {
          var user = users[j];
          if (user.roles == role) {
            userResult.push(user.userEmail);
            content.append('<div><span>' + user.displayName + '</span><span><a href="javascript:">' + user.userEmail + '</a></span></div>')
          }
        }
        $('#copyUserEmailBtn').text('Copy addresses');
        if (userResult.length == 0) {
          $('#copyUserEmailBtn').attr('data-clipboard-text', '');
          $('#copyUserEmailBtn').prop('disabled', true);
          $('#sendUserEmailBtn').prop('disabled', true);
        } else {
          $('#copyUserEmailBtn').prop('disabled', false);
          $('#sendUserEmailBtn').prop('disabled', false);
          var addressStr = userResult.join(', ');
          $('#copyUserEmailBtn').attr('data-clipboard-text', addressStr);
        }
        $('#userDetailOverlay>h1:nth-child(1)').html($('#table6 thead tr').children(':nth-child(' + (index + 1) + ')').html() + ' (' + userResult.length + ')');
        console.log('content', content)
        IBMCore.common.widget.overlay.show('userDetailOverlay');
      })
      var table = $('#table6 table').DataTable({
        "iDisplayLength": 25,
        "scrollY": '51vh',
        "scrollX": false,
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

      table.on('select', function(e, dt, type, indexes) {
        selectRows();
      }).on('deselect', function(e, dt, type, indexes) {
        selectRows();
      });

      $('#table6 .emailUsers button').click(function() {
        if (!$(this).hasClass('disabled')) {
          var top = $(this).offset().top;
          var left = $(this).offset().left;
          $('#emailUsersPopup').css({
            top: top + 18,
            left: left - 10
          });
          $('#emailUsersPopup').show();
        }
      })

      var blogNames = [];
      var addressStr = '';

      function selectRows() {
        resetEmailUsersPopup();
        blogNames = [];
        addressStr = '';
        var totalCount = 0;
        var authorCount = 0;
        var subCount = 0;
        var conCount = 0;
        var siteCount = 0;
        var adminCount = 0;
        if (table.rows({ selected: false }).count() == 0) {
          $('#table6 table input.selectAll').prop('checked', true);
        } else {
          $('#table6 table input.selectAll').prop('checked', false);
        }

        if (table.rows({ selected: true }).count() == 0) {
          $('#table6 p.emailUsers button').addClass('disabled');
        } else {
          $('#table6 p.emailUsers button').removeClass('disabled');
        }

        for (var i in table.rows({ selected: true }).data().toArray()) {
          var rows = table.rows({ selected: true }).data().toArray()[i];
          var blogName = rows[1].substr(6, rows[1].indexOf('</span>') - 6);
          blogNames.push(blogName)
        }

        if (blogNames.length > 0) {
          for (var i in userData.rows) {
            var blog = userData.rows[i];
            if (blogNames.indexOf(blog.id) == -1) {
              continue;
            }
            totalCount += blog.value.totalCount;
            authorCount += blog.value.authorCount;
            conCount += blog.value.conCount;
            siteCount += blog.value.siteCount;
            subCount += blog.value.subCount;
            adminCount += blog.value.adminCount;
          }
        }

        $("#emailUsersPopup label[for='allRolesPopup']").text("All Roles (" + totalCount + ')');
        $("#emailUsersPopup label[for='authorRolePopup']").text("Authors (" + authorCount + ')');
        $("#emailUsersPopup label[for='subRolePopup']").text("Subscribers (" + subCount + ')');
        $("#emailUsersPopup label[for='conRolePopup']").text("Contributors (" + conCount + ')');
        $("#emailUsersPopup label[for='siteRolePopup']").text("Site Owners (" + siteCount + ')');
        $("#emailUsersPopup label[for='adminRolePopup']").text("Administrators (" + adminCount + ')');

        $("#emailUsersPopup input#authorRolePopup").prop('disabled', (authorCount !== 0) ? false : true);
        $("#emailUsersPopup input#subRolePopup").prop('disabled', (subCount !== 0) ? false : true);
        $("#emailUsersPopup input#conRolePopup").prop('disabled', (conCount !== 0) ? false : true);
        $("#emailUsersPopup input#siteRolePopup").prop('disabled', (siteCount !== 0) ? false : true);
        $("#emailUsersPopup input#adminRolePopup").prop('disabled', (adminCount !== 0) ? false : true);

      }

      $('#emailUsersPopup input[name="allorspe"]').change(function() {
        if ($(this).val() === 'all') {
          $('#sendEmailBtn').prop('disabled', false);
          $('#copyEmailBtn').removeClass('disabled');
        } else if ($('#emailUsersPopup input[name="typeInSpe"]:checked').val() == undefined) {
          $('#sendEmailBtn').prop('disabled', true);
          $('#copyEmailBtn').addClass('disabled');
        } else {
          $('#sendEmailBtn').prop('disabled', false);
          $('#copyEmailBtn').removeClass('disabled');
        }
        calEmails();
      })

      $('#emailUsersPopup input[name="typeInSpe"]').change(function() {
        if ($('#emailUsersPopup input[name="typeInSpe"]:checked').val() == undefined) {
          $('#sendEmailBtn').prop('disabled', true);
          $('#copyEmailBtn').addClass('disabled');
        } else {
          $('#sendEmailBtn').prop('disabled', false);
          $('#copyEmailBtn').removeClass('disabled');
        }
        calEmails();
      })


      $('#sendEmailBtn').click(function() {
        console.log('addressStr', addressStr)
        window.open('mailto:' + addressStr);
      });

      $('#table6 .emailUsers button').click(function() {
        if (!$(this).hasClass('disabled')) {
          $('.copyAddressBtn').text('Copy addresses');
          if (addressStr === '') {
            calEmails();
          }
        }
      })

      $('#table6 table input.selectAll').on('click', function() {
        if ($(this).prop('checked')) {
          table.rows().select();
        } else {
          table.rows().deselect();
        }
      });

      function calEmails() {
        addressStr = '';
        $('.copyAddressBtn').text('Copy addresses');
        var emails = [];
        if ($('#emailUsersPopup input#allRolesPopup').prop('checked')) {
          for (var i in userData.rows) {
            var blog = userData.rows[i]
            if (blogNames.indexOf(blog.id) == -1) {
              continue;
            }
            var users = blog.value.users;
            for (var j in users) {
              var addr = users[j].userEmail;
              if (emails.indexOf(addr) !== -1 && emails.length != 0) {
                continue;
              }
              emails.push(addr);
            }
          }
        } else {
          var roleTypes = [];
          if ($('#emailUsersPopup input#authorRolePopup').prop('checked')) {
            roleTypes.push('author')
          }
          if ($('#emailUsersPopup input#subRolePopup').prop('checked')) {
            roleTypes.push('subscriber')
          }
          if ($('#emailUsersPopup input#conRolePopup').prop('checked')) {
            roleTypes.push('editor')
          }
          if ($('#emailUsersPopup input#siteRolePopup').prop('checked')) {
            roleTypes.push('site_owner')
          }
          if ($('#emailUsersPopup input#adminRolePopup').prop('checked')) {
            roleTypes.push('administrator')
          }
          for (var i in userData.rows) {
            var blog = userData.rows[i]
            if (blogNames.indexOf(blog.id) == -1) {
              continue;
            }
            var users = blog.value.users;
            for (var j in users) {
              var user = users[j]
              if (roleTypes.indexOf(user.roles) === -1) {
                continue
              }
              if (emails.indexOf(user.userEmail) !== -1 && emails.length != 0) {
                continue;
              }
              emails.push(user.userEmail);
            }
          }
        }
        console.log('emails', emails.length);
        addressStr = emails.join(', ');
        $('#copyEmailBtn').attr('data-clipboard-text', addressStr);
      }
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
          console.log('pageDetails', pageData);
        },
        error: function(error) {
          pageData = [];
          console.error('pageDetails Error', error);
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
        $.ajax({
          url: '/userDetails?version=' + currentVersion,
          success: function(result) {
            userData = result;
            console.log("userDetails", userData);
            loadSuccess();
          },
          error: function(error) {
            userData = [];
            console.error("userDetails Error", error);
            loadFailed();
          }
        })
      },
      error: function(err) {
        console.error('dashBoard', err);
        blogs = 'error';
        loadFailed();
      }
    });

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
    $('#table2FilterOp1').val('equal').change();
    $('#table2Filter1').val('all').change();
    $('#table2FilterOp2').val('equal').change();
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

  function resetEmailUsersPopup() {
    $("#emailUsersPopup input#allRolesPopup").prop('checked', true);
    $("#emailUsersPopup input#authorRolePopup").prop('checked', false);
    $("#emailUsersPopup input#subRolePopup").prop('checked', false);
    $("#emailUsersPopup input#conRolePopup").prop('checked', false);
    $("#emailUsersPopup input#siteRolePopup").prop('checked', false);
    $("#emailUsersPopup input#adminRolePopup").prop('checked', false);
    $('#speRolesPopupGroup').hide();
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

  function compareVersion(ver1, ver2) {
    var arr1 = ver1.split('.');
    var arr2 = ver2.split('.');

    var len = arr1.length > arr2.length ? arr1.length : arr2.length;
    for (var i = 0; i < len; i++) {
      if ((parseInt(arr1[i]) || 0) > (parseInt(arr2[i]) || 0)) {
        return 1;
      } else if ((parseInt(arr1[i]) || 0) < (parseInt(arr2[i]) || 0)) {
        return -1;
      }
    }
    return 0;
  }

});
