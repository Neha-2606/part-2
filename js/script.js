/*
  Author:[Neha Gaddala]
  Contact:[Neha_Gaddala@student.uml.edu]
  Description: JavaScript for COMP 4610 HW4 Part 2.
  Implements form validation, jQuery UI sliders with two-way binding, a tabbed interface,
  and a reset button. Uses a fixed background image defined in style.css.
  Sources:
  - jQuery Validation: https://jqueryvalidation.org/
  - jQuery UI: https://jqueryui.com/
  - Original logic from previous assignment
*/

$(document).ready(function () {
  console.log("jQuery version:", $.fn.jquery);
  console.log("jQuery Validation Plugin loaded:", !!$.validator);
  console.log("jQuery UI loaded:", !!$.ui);

  $("#tabs").tabs();

 
  $("#startColSlider").slider({
    min: -50,
    max: 50,
    value: 0,
    slide: function (event, ui) {
      $("#startCol").val(ui.value).trigger("change");
    }
  });
  $("#endColSlider").slider({
    min: -50,
    max: 50,
    value: 0,
    slide: function (event, ui) {
      $("#endCol").val(ui.value).trigger("change");
    }
  });
  $("#startRowSlider").slider({
    min: -50,
    max: 50,
    value: 0,
    slide: function (event, ui) {
      $("#startRow").val(ui.value).trigger("change");
    }
  });
  $("#endRowSlider").slider({
    min: -50,
    max: 50,
    value: 0,
    slide: function (event, ui) {
      $("#endRow").val(ui.value).trigger("change");
    }
  });

 
  $("#startCol").on("input change", function () {
    $("#startColSlider").slider("value", parseInt($(this).val()) || 0);
  });
  $("#endCol").on("input change", function () {
    $("#endColSlider").slider("value", parseInt($(this).val()) || 0);
  });
  $("#startRow").on("input change", function () {
    $("#startRowSlider").slider("value", parseInt($(this).val()) || 0);
  });
  $("#endRow").on("input change", function () {
    $("#endRowSlider").slider("value", parseInt($(this).val()) || 0);
  });

 
  const validator = $("#tableForm").validate({
    rules: {
      startCol: {
        required: true,
        number: true,
        range: [-50, 50]
      },
      endCol: {
        required: true,
        number: true,
        range: [-50, 50],
        greaterThanEqual: "#startCol"
      },
      startRow: {
        required: true,
        number: true,
        range: [-50, 50]
      },
      endRow: {
        required: true,
        number: true,
        range: [-50, 50],
        greaterThanEqual: "#startRow"
      }
    },
    messages: {
      startCol: {
        required: "Please enter a start column value.",
        number: "Start column must be a number.",
        range: "Start column must be between -50 and 50."
      },
      endCol: {
        required: "Please enter an end column value.",
        number: "End column must be a number.",
        range: "End column must be between -50 and 50.",
        greaterThanEqual: "End column must be greater than or equal to start column."
      },
      startRow: {
        required: "Please enter a start row value.",
        number: "Start row must be a number.",
        range: "Start row must be between -50 and 50."
      },
      endRow: {
        required: "Please enter an end row value.",
        number: "End row must be a number.",
        range: "End row must be between -50 and 50.",
        greaterThanEqual: "End row must be greater than or equal to start row."
      }
    },
    errorPlacement: function (error, element) {
      error.insertAfter(element.next(".slider")); 
    },
    submitHandler: function (form, event) {
      event.preventDefault(); 
      console.log("Form is valid, generating table...");
      generateTable();
    }
  });


  $.validator.addMethod("greaterThanEqual", function (value, element, param) {
    var target = $(param).val();
    if (value && target) {
      return parseInt(value) >= parseInt(target);
    }
    return true;
  }, "This value must be greater than or equal to the start value.");


  function generateTable() {
    const startCol = parseInt($("#startCol").val());
    const endCol = parseInt($("#endCol").val());
    const startRow = parseInt($("#startRow").val());
    const endRow = parseInt($("#endRow").val());
    const errorMsg = $("#errorMsg");

    console.log("Generating table with:", { startCol, endCol, startRow, endRow });

    errorMsg.text("");

   
    const tabId = "table-" + Date.now();
    const tabLabel = `Table: ${startCol} to ${endCol}, ${startRow} to ${endRow}`;
    const tabLi = $(`<li><a href="#${tabId}">${tabLabel}</a><span class="delete-tab">X</span></li>`);
    const tabContent = $(`<div id="${tabId}" class="tab-content"><div class="tableContainer"><table class="multTable"></table></div></div>`);

    $("#tabs ul").append(tabLi);
    $("#tabs").append(tabContent);
    $("#tabs").tabs("refresh");

  
    const table = tabContent.find(".multTable");
    const headerRow = $("<tr>").append($("<th>"));
    for (let col = startCol; col <= endCol; col++) {
      headerRow.append($("<th>").text(col));
    }
    table.append(headerRow);

    for (let row = startRow; row <= endRow; row++) {
      const tr = $("<tr>");
      tr.append($("<th>").text(row));
      for (let col = startCol; col <= endCol; col++) {
        tr.append($("<td>").text(row * col));
      }
      table.append(tr);
    }

    const tabIndex = $("#tabs ul li").length - 1;
    $("#tabs").tabs("option", "active", tabIndex);
  }

 
  function resetFormAndTable() {
    console.log("Resetting form, sliders, and validation state...");
    $("#tableForm")[0].reset(); 
    $("#errorMsg").text(""); 
    validator.resetForm(); 
  
    $("#startColSlider").slider("value", 0);
    $("#endColSlider").slider("value", 0);
    $("#startRowSlider").slider("value", 0);
    $("#endRowSlider").slider("value", 0);
  }

 
  $("#resetButton").on("click", function () {
    resetFormAndTable();
  });

 
  $(document).on("click", ".delete-tab", function () {
    const li = $(this).closest("li");
    const tabId = li.find("a").attr("href");
    li.remove();
    $(tabId).remove();
    $("#tabs").tabs("refresh");

    if ($("#tabs ul li").length === 1) {
      $("#tabs").tabs("option", "active", 0);
    }
  });


  $("#deleteAllTabs").on("click", function () {
    console.log("Deleting all table tabs...");
    $("#tabs ul li").not(":first").remove();
    $("#tabs > div").not("#input-tab").remove();
    $("#tabs").tabs("refresh");
    $("#tabs").tabs("option", "active", 0);
  });

  
  $("#tableForm input").on("change", function () {
    if ($("#tableForm").valid()) {
      console.log("Input changed, generating new table...");
      generateTable();
    }
  });


  $("#tableForm").on("submit", function (event) {
    event.preventDefault();
    console.log("Form submit intercepted, relying on validation plugin.");
  });
});