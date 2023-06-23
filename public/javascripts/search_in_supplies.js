
$(document).ready(function() {
});
  

  function debounce(func, delay=600) {
    let timeoutId;
    let lastArgs;
    return function(...args) {
      lastArgs = args;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, lastArgs);
        timeoutId = null;
      }, delay);
    };
  }
  function parseDateString(dateString) {
    // Split the date string into day, month, and year components
    var dateComponents = dateString.split('/');
    
    // Create a new Date object using the extracted components
    // JavaScript's Date object expects the month to be zero-based, so we subtract 1 from the month value
    var parsedDate = new Date(dateComponents[2], dateComponents[1] - 1, dateComponents[0]);
    
    return parsedDate;
  }
  
// populate body with found elements
// $('#search_val').keyup(debounce(foundSupplies));

  $("body").delegate(".individual", "click",function(event) {
    $("#search_val").val($(this).val())
    $(".custom-select").val("name")
    foundSupplies(event)
  })

  $('#search_val').on('keyup', function(event) {
    if (event.keyCode === 13) {
        if($(".custom-select").val() == 'stock'){
          
          foundSupplies_existence(event);
        }else{
          foundSupplies(event);
        }
    }
  });

  // Add a click event listener to the search button
  $('#search-button').on('click', function(event) {
    console.log('search btn');
      if($(".custom-select").val() == 'stock'){
        console.log('calleeddded')
          foundSupplies_existence(event);
      }else{
          foundSupplies(event);
  
      }
  });
//   $( "#individual" ).click(function(event) {
//     event.preventDefault()
//     alert( "Handler for .click() called." );
//   })

$('.custom-select').change(function(event){
  console.log('custom select changed')
  console.log($('.custom-select').val())
    if($(".custom-select").val() == 'stock'){
      console.log('calleeddded')
        foundSupplies_existence(event);
    }else{
        foundSupplies(event);

}  });



//======== Functions=====

  function makeDMYHour(date){
    const newDate = {d:date.getUTCDate(), m : date.getUTCMonth()+1,// JavaScript months are 0-11
    y : date.getUTCFullYear(),h:date.getUTCHours(), min:(((""+date.getUTCMinutes()).length>1)?date.getUTCMinutes():"0"+date.getUTCMinutes())};
    return  ((newDate.d.toString().length>1)?newDate.d:"0"+newDate.d)+ "/" + newDate.m+ "/" + newDate.y+ " "+newDate.h+":"+newDate.min;
  }

  function getMexicoCityTime() {
    const now = new Date();
    const mexicoCityOffset = -6 * 60; // Mexico City is UTC-6
    const mexicoCityTime = new Date(now.getTime() + mexicoCityOffset * 60 * 1000);
    return mexicoCityTime;
  }
    function numberCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const nDate = getMexicoCityTime();

//function for making day--month--year format
function makeDMY(date){
    const newDate = {d:date.getUTCDate(), m : date.getUTCMonth()+1,// JavaScript months are 0-11
    y : date.getUTCFullYear()};
    return  ((newDate.d.toString().length>1)?newDate.d:"0"+newDate.d)+ "/" + newDate.m+ "/" + newDate.y;
}
//difference in months between two dates
function diff_months(dt2, dt1) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
   diff /= (60 * 60 * 24 * 7 * 4);
  return Math.round(diff);
 }
//function for selecting the border color based on existence and optimum parameters
function defineBorder(proportion){
    let border = "";
    if(proportion<=0.33){
        border = "danger";
    }else if(proportion>0.33 && proportion < 0.66){
        border = "warning"
    }else{
        border =  "success"
    }
    return border
}

// Fill table with data
function foundSupplies(event) {
    let currentRequest = null;
    console.log('found supplies')
    const page = $(event.target).attr('data-page');

    const dat = {'search':$("#search_val").val(),'sorted':$(".custom-select").val(),'page':page};
    let suppliesContent = '';
   $.ajax({
    type: 'GET',
    url: '/services/searchSupplies',
    data: dat,
    dataType: 'JSON',
    processData: true,
    beforeSend : function()    {          
        if(currentRequest != null) {
            currentRequest.abort();
        }
    },
    cache: false
    }).done(function( response ){
        suppliesContent+=`<div class="row supplies scrollDiv">`
        $.each(response.supplies, function(){
            //create a unique id. Add "a" as prefix so that avery string is acceptable
            let id_name = "a"+Math.random().toString(36).substring(7);
            suppliesContent+=(`
                <div class="col-3">
                    <div class="card mb-3">
                        <div id="`+id_name+`" class="carousel slide" data-ride="carousel">
                            <div class="carousel-inner">`);
                 this.images.forEach((img, i) => {
                if(i==0){
                    suppliesContent+=(`<div class="carousel-item active">
                     <img class="card_img mt-4" src="`+img.url+`"  alt="">
                 </div>`
                 )
                }else{
                    suppliesContent+=(`<div class="carousel-item">
                        <img class="card_img mt-4" src="`+img.url+`"  alt="">
                    </div>`
                    )
                }
                 });
                 suppliesContent+=`</div>`;
                  if(this.images.length > 1) {
                      suppliesContent+=(`
                    <a class="carousel-control-prev " href="#`+id_name+`" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#`+id_name+`" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>`);
                  }
                 const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',timeZone: 'America/Mexico_City' };
                 let dateColor = defineBorder(diff_months(new Date(this.expiration) , new Date())/12);
                 let stockColor = defineBorder(this.stock/this.optimum);
                  suppliesContent+=(`
                        </div>
                        <div class="card-body">
                            <div class = "d-inline"><h3 class="card-subtitle ">`+this.name+`</h3><h6>`+this.principle+`</h6></div>
                            <h5 class="card-title text-muted">`+ this.class+`</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                        <li class="list-group-item border border-`+dateColor+` ">Caducidad: <span class = "expiration">`+makeDMY(new Date(this.expiration))+`</span></li>
                        <div class="clearfix split-items">
                        <li class="list-group-item" id = "serviceID" alt = "`+this._id+`" style="display: none;"></li>

                        <li class="list-group-item left-side ">Existencias:<br><span class = " stock border border-`+stockColor+` rounded-circle px-3 py-2 d-inline-block ">`+ this.stock+` </span></li>`
);
                    // if(this.outside){
                        suppliesContent+=(`<li class="list-group-item right-side">En Bodega: `+(this.stock-this.outside)+`</li></div>`)
                    // }

                    suppliesContent+=(` 
                            <li class="list-group-item">Proveedor: `+this.supplier+`</li>
                            <div class="clearfix split-items">
                                <li class="list-group-item left-side">Compra: $`+ this.buy_price+` /cu</li>
                                <li class="list-group-item right-side ">Venta: $`+this.sell_price+` /cu</li>
                            </div>
                        </ul>`);
                    if(true){
                suppliesContent+= (`<div class="d-flex justify-content-around mx-1 my-1">
                            <a class="card-link btn btn-info" href="/services/`+this._id+`/edit?service_type=supply"><i class="fas fa-edit"></i></a>
                            <a class="card-link btn btn-secondary" href="/services/`+this._id+`/supply"><i class="fas fa-copy"></i></a>
                            <form class="d-inline" action="/services/`+this._id+`?_method=DELETE" method="POST">
                                <button class="btn btn-danger"><i class="fas fa-trash"></i></button>
                            </form>
                        </div>`);
                         }
                suppliesContent+= (`</div>
                                        </div>`);
            
                 });
                 let pagination = `<div class="row my-3 pagination customClass">
                 <div class="btn-group float-right" role="group" aria-label="First group">`;

               if (response.page > 1) {
                 pagination += `<a data-page="${response.page - 1}" class="btn btn-light pagination-button-normal" role="button" aria-pressed="true"><i class="fas fa-arrow-circle-left"></i></a>`;
               }

               for (let step = 1; step < response.pages + 1; step++) {
                 let act = (step == response.page) ? "active" : "";
                 pagination += `<a data-page="${step}" class="btn btn-light pagination-button-normal ${act}" role="button" aria-pressed="true">${step}</a>`;
               }

               if (response.page + 1 <= response.pages) {
                 pagination += `<a data-page="${response.page + 1}" class="btn btn-light pagination-button-normal" role="button" aria-pressed="true"><i class="fas fa-arrow-circle-right"></i></a>`;
               }

               pagination += `</div>
                 </div>`;
                 $('.supplies').html( suppliesContent);  
                 $('.pagination').replaceWith( pagination); 
                 $("selector").find('option[value="'+response.sorted+'"]').attr('selected','selected')
                 $("#search_val").val(response.search)

     
   });
 };

//Add more to existence


$(document).on("click", ".minus2", function() {
  const quantityInput = $(this).parent().children(".quantity");
  const currentValue = parseInt(quantityInput.val());
  if (currentValue - 1 >= 0) {
    quantityInput.val(currentValue - 1);
    const discountButton = $(this).closest("td").find(".discount-button");

    // Set the toggle to inactive
    discountButton.removeClass("btn-discount-inactive btn-secondary");
    discountButton.addClass("btn-discount-active btn-primary");
    discountButton.html('<i class="fas fa-paper-plane"></i>'); 

  }
});

$(document).on("click", ".plus2", function() {
  console.log('called plus');
  const quantityInput = $(this).parent().children(".quantity");
  const currentValue = parseInt(quantityInput.val());
  if (currentValue + 1 < 999) {
    quantityInput.val(currentValue + 1);
    console.log('about to update')
    const discountButton = $(this).closest("li").find(".discount-button");

    // Set the toggle to inactive
    discountButton.removeClass("btn-discount-inactive btn-secondary");
    discountButton.addClass("btn-discount-active btn-primary");
    discountButton.html('<i class="fas fa-paper-plane"></i>'); 
  }
});

$(document).on("click", ".quantity", function() {
    const discountButton = $(this).closest("li").find(".discount-button");
    // Set the toggle to inactive
    discountButton.removeClass("btn-discount-inactive btn-secondary");
    discountButton.addClass("btn-discount-active btn-primary");
    discountButton.html('<i class="fas fa-paper-plane"></i>'); 
  });
  
  


//EXISTENCE REPORT
$('#toggle-button').on('click', function() {
    var numberInputForm = $('#limitExistence');
  
    if (numberInputForm.is(':hidden')) { // Check if the div is hidden instead of visible
        console.log('is not visible')
      numberInputForm.show(); // Show the div
      $(this).text('Todo'); // Change the button text
    } else {
        console.log('Visible')
      numberInputForm.hide(); // Hide the div
      $(this).text('Limite'); // Change the button text
    }
});


$('#printExistences').on('click',listExistence)

function listExistence(event) {
    console.log('from printExistences');
    let currentRequest = null;
    let lm = 99999;
    if(!$('#limitExistence').is(':hidden')){
        console.log('inside inputed limit');
        console.log($('.quantityEX').val());
        lm = $('.quantityEX').val()
    }
    const dat = {'search':$("#search_val").val(),'sorted':$(".custom-select").val(),limit:lm};
    console.log('data for printing existences')
    console.log(dat)
    let suppliesContent = '';
   $.ajax({
    type: 'GET',
    url: '/services/searchSupplyLimit',
    data: dat,
    dataType: 'JSON',
    processData: true,
    beforeSend : function()    {          
        if(currentRequest != null) {
            currentRequest.abort();
        }
    },
    cache: false
    }).done(function( response ){
        listSupplies = response.supplies;
        printListExistence(listSupplies)
    })
}

var printer;

async function printListExistence(listExistence) {
    // Handle the printing of a specific transaction here
    console.log('listExisctence FROM PRINT TICKET FUNCTION');
    console.log(listExistence)
    serviceUuid = 'e7810a71-73ae-499d-8c15-faa9aef0c3f2';
    characteristicUuid = 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f';
     deviceKey = 'lastUsedDevice'; // Key for storing the device address
     const encoder = new TextEncoder();

 
  printData1 = new Uint8Array([
   0x1B, 0x40, // Initialize the printer
   0x1B, 0x21, 0x20, // Set the font size to double height
   0x1B, 0x61, 0x01, // Align text to center
   ...encoder.encode('Lista de existencias'), 
 ]);

 
 let receiptContent = '';
        receiptContent += `Nombre - Principio  \n                       Optimo   Existencias\n`;
        receiptContent += `------------------------------------------\n`;

        listExistence.forEach(function (service, index) {
            receiptContent += `${service.name.padEnd(15)}  ${service.principle.padEnd(15)}\n                            ${service.optimum.toString().padEnd(8)}  ${service.stock.toString().padEnd(8)}\n`;
        });
 
 dateNow = getMexicoCityTime()
  hour = dateNow.getUTCHours(); // Get the hour component of the datetime
  minutes = dateNow.getUTCMinutes(); // Get the minutes component of the datetime
   amOrPm = hour >= 12 ? 'PM' : 'AM'; // Determine whether the time is in the AM or PM
  formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert the hour to 12-hour format
  formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add a leading zero to minutes if necessary
  formattedTime = `${formattedHour}:${formattedMinutes} ${amOrPm}`; 
 
 // Add patient name and services to the ticket body
 printData2 = new Uint8Array([
   0x1B, 0x61, 0x00, // Align text to left
   0x1B, 0x21, 0x00, // Set the font size to normal
   0x0A, // Print a line feed
   ...encoder.encode('               '+dateNow.toLocaleDateString()+' '+formattedTime), 
   0x0A, // Print a line feed
   0x0A, // Print a line feed
   ...encoder.encode(receiptContent),

   0x0A, // Print a line feed
   0x0A, // Print a line feed
   0x0A, // Print a line feed
   0x0A, // Print a line feed
   0x1D, 0x56, 0x41, 0x10,
//    0x1B, 0x70, 0x00, 0x19, 0xFF //linea para abrir la caja


 ]);
 
 // var printData = new Uint8Array([...printData1,...printData2]);
   try {
       if(printer){
         device = printer
       }else{
         device = await navigator.bluetooth.requestDevice({
           filters: [{ name: 'Printer001' ,deviceId:'OsURHI+3wBk8YoxCAZGClg=='}],
           optionalServices: [serviceUuid],
         });
         printer = device;
       }    
 
     const server = await device.gatt.connect();
     const service = await server.getPrimaryService(serviceUuid);
     const characteristic = await service.getCharacteristic(characteristicUuid);
     const encoder = new TextEncoder();
 
     await characteristic.writeValue(printData1);
     const CHUNK_SIZE = 50; // define the size of each chunk
 const chunks = []; // array to hold the chunks
 
 // split the printData2 array into chunks of CHUNK_SIZE bytes
 for (let i = 0; i < printData2.length; i += CHUNK_SIZE) {
   chunks.push(printData2.slice(i, i + CHUNK_SIZE));
 }
 
 // send each chunk with a delay between them
 for (let i = 0; i < chunks.length; i++) {
   // setTimeout(async () => {
     await characteristic.writeValue(chunks[i]);
   // }, i * 1000); // add a delay of 1 second between each chunk (adjust the delay time as needed)
 }
   console.log('device to be stored');
   console.log(device)
 
     await server.disconnect();
 
   } catch (error) {
     console.error(error);
   }  
  }


$(document).on("click", ".minusEX", function() {
  const quantityInput = $(this).parent().children(".quantityEX");
  const currentValue = parseInt(quantityInput.val());
  if (currentValue - 1 >= 0) {
    quantityInput.val(currentValue - 1);
  }
})
$(document).on("click", ".plusEX", function() {
  const quantityInput = $(this).parent().children(".quantityEX");
  const currentValue = parseInt(quantityInput.val());
  if (currentValue + 1 < 99999) {
    quantityInput.val(currentValue + 1);
  }
})


$('#genPDf').click(generatePDF)

function generatePDF() {
  var content = document.getElementById('suppliesContent').innerHTML;

  // Convert the content into a table
  var tableContent = convertToTable(content);

  fetch('https://clinicasanromanadmin-production.up.railway.app/services/generate-pdf-exists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: tableContent, // Send the table content to the server
    }),
  })
  .then(response => response.blob())
  .then(blob => {
    // Create a blob URL and download the file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `existencias_${nDate.toISOString()}.pdf`;
    a.click();
  })
  .catch(error => console.error('Error:', error));
}

function convertToTable(content) {
  // Create a new div element to hold the table
  var div = document.createElement('div');
  div.innerHTML = content;

  // Find the elements containing the data
  var supplyItems = div.getElementsByClassName('col-3');
  var tableHTML = '<table class="table table-striped">';
  console.log('supply items')
  console.log(supplyItems)
  if($(".custom-select").val() == 'stock'){

  // Create the table header row
  tableHTML += '<thead>' +
  '<tr>' +
  '<th>Nombre</th>' +
  '<th>Principio</th>' +
  '<th>Clase</th>' +
  '<th>Optimo</th>' +
  '<th>Cantidad</th>' +
  '</tr>' +
  '</thead>';

// Create the table body
tableHTML += '<tbody>';

// Iterate over the supply items and extract the data
for (var i = 0; i < supplyItems.length; i++) {
  var supplyItem = supplyItems[i];

  // Extract the relevant data from the supply item
  var name = supplyItem.querySelector('.card-subtitle').textContent;
  var principle = supplyItem.querySelector('h6').textContent;
  var supplyClass = supplyItem.querySelector('.card-title').textContent;
  var optimum = supplyItem.querySelector('.optimum').textContent;
  var stock = supplyItem.querySelector('.stock').textContent;

  let stockColor = defineBorder(stock/optimum);

  // Build the table row HTML with Bootstrap classes
  var rowHTML = '<tr>' +
    '<td>' + name + '</td>' +
    '<td>' + principle + '</td>' +
    '<td>' + supplyClass + '</td>' +
    '<td>' + optimum + '</td>' +
    '<td class = "border border-'+stockColor+'">' + stock + '</td>' +
    '</tr>';

  // Add the row HTML to the table body
  tableHTML += rowHTML;
}

  }else{


  // Create the table header row
  tableHTML += '<thead>' +
    '<tr>' +
    '<th>Nombre</th>' +
    '<th>Principio</th>' +
    '<th>Clase</th>' +
    '<th>Caducidad</th>' +
    '<th>Cantidad</th>' +
    '</tr>' +
    '</thead>';

  // Create the table body
  tableHTML += '<tbody>';

  // Iterate over the supply items and extract the data
  for (var i = 0; i < supplyItems.length; i++) {
    var supplyItem = supplyItems[i];

    // Extract the relevant data from the supply item
    var name = supplyItem.querySelector('.card-subtitle').textContent;
    var principle = supplyItem.querySelector('h6').textContent;
    var supplyClass = supplyItem.querySelector('.card-title').textContent;
    var caducity = supplyItem.querySelector('.expiration').textContent;
    console.log('expiration')
    console.log(new Date(parseDateString(caducity)))

    var stock = supplyItem.querySelector('.stock').textContent;
    let dateColor = defineBorder(diff_months(new Date(parseDateString(caducity)) , new Date())/12);
    // Build the table row HTML with Bootstrap classes
    var rowHTML = '<tr>' +
      '<td>' + name + '</td>' +
      '<td>' + principle + '</td>' +
      '<td>' + supplyClass + '</td>' +
      '<td class = "border border-'+dateColor+'">' + caducity + '</td>' +
      '<td>' + stock + '</td>' +
      '</tr>';

    // Add the row HTML to the table body
    tableHTML += rowHTML;
  }
}


  tableHTML += '</tbody></table>';

  return tableHTML;
}



const deleteExpiredButton = document.getElementById('deleteExpired');
const deleteZeroButton = document.getElementById('deleteZero');

// Add event listeners to the buttons
deleteExpiredButton.addEventListener('click', () => {
  console.log('clicked delete expired')
  // Call the deleteExpired API route
  fetch('/services/supply/deleteExpired', {
    method: 'PUT',
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data
      location.reload();
      // Refresh the page or perform any other actions
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
    });
});

deleteZeroButton.addEventListener('click', () => {
  // Call the deleteOutOfStock API route
  console.log('clicked out of stock')
  fetch('/services/supply/outOfStock', {
    method: 'PUT',
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data
      location.reload();
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
    });
});




 //give the existence format
 
 function foundSupplies_existence(event){
  console.log('found existence called')
  const page = $(event.target).attr('data-page');

  const dat = {'search':$("#search_val").val(),
  'sorted':$(".custom-select").val(),'json':true,'page':page};
  let suppliesContent = "";
 $.ajax({
  counter:0,
  type: 'GET',
  url: '/services/searchSupplies',
  data: dat,
  dataType: 'JSON',
  processData: true,
  }).done(function(response){    
      console.log('suplies with existence');
      console.log(response.supplies.length);
      suppliesContent+=`<div class="row supplies scrollDiv">`
      $.each(response.supplies, function(){
          let array_len = this.expiration.length;
          //create a unique id. Add "a" as prefix so that avery string is acceptable
          let id_name = "a"+Math.random().toString(36).substring(7);
          suppliesContent+=(`
              <div class="col-3">
                  <div class="card mb-3">
                      <div id="`+id_name+`" class="carousel slide" data-ride="carousel">
                          <div class="carousel-inner">`);
               this.images.forEach((img, i) => {
              if(i==0){
                  suppliesContent+=(`
                  <div class="carousel-item active">
                     <img class="card_img mt-4" src="`+img.url+`"  alt="">
                  </div>`
               )
              }else{
                  suppliesContent+=(`
                  <div class="carousel-item">
                      <img class="card_img mt-4" src="`+img.url+`"  alt="">
                  </div>`
                  )
              }
               });
               suppliesContent+=`</div>`;
                if(this.images.length > 1) {
                    suppliesContent+=(`
                  <a class="carousel-control-prev " href="#`+id_name+`" role="button" data-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="sr-only">Previous</span>
                  </a>
                  <a class="carousel-control-next" href="#`+id_name+`" role="button" data-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="sr-only">Next</span>
                  </a>`);
                }
               const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
               let stockColor = defineBorder(this.totalStock/this.optimum);
               suppliesContent+=(`
                          </div>
                          <div class="card-body">
                              <div class = "d-inline"><h3 class="card-subtitle ">`+this.name+`</h3><h6>`+this.principle+`</h6></div>
                              <h5 class="card-title text-muted">`+ this.class+`</h5>
                          </div>
                          <ul class="list-group list-group-flush">
                                      <div class="clearfix split-items ">
                                      <li class="list-group-item left-side ">Total <br><span class = "border border-`+stockColor+` rounded-circle px-3 py-2 d-inline-block stock">`+ this.totalStock+` </span></li>
                                      <li class="list-group-item right-side">Optimo<br> <span class = "optimum">`+Math.round(this.optimum)+`</span> </li>
                                   </div>`);
              if(this.outside){
                  suppliesContent+=(`<li class="list-group-item">En Bodega: `+(this.totalStock-this.outside)+`</li>`)
              }
               suppliesContent+=(`  </ul>
                          <table class="table mb-0 equalTable">
                              <thead>
                                  <tr>
                                  <th class="table-dark" scope="col">Caducidad</th>
                                  <th class="table-dark" scope="col">Existencias</th>
                                  </tr>
                              </thead>
                              <tbody>
                          `);
                   (this.expiration).forEach((element,index) => {
                      let dateColor = defineBorder(diff_months(new Date(this.expiration[index]) , new Date())/12)
                      suppliesContent+=(`
                      <tr>
                          <td class ="border border-${dateColor}">`+makeDMY(new Date(element))+`</td>
                          <td>`+this.stock[index]+`</td>
                      </tr>`);
                   });
               suppliesContent+=(` 
                  </tbody>
                  </table>
                  <ul class="list-group list-group-flush">
                      <div class="clearfix split-items">
                          <li class="list-group-item left-side">Compra: $`+ this.buy_price+` /cu</li>
                          <li class="list-group-item right-side ">Venta: $`+this.sell_price+` /cu</li>
                      </div>
                  </ul>`)
               if(array_len>1){

                  suppliesContent+=(`
                  <div class="d-flex justify-content-around mx-1 my-1">
                      <button class="card-link btn btn-info individual" value = "`+this.name+`">Ver individualmente</button>
                  </div>
                  `)
               }else{
                      if(true){
                  suppliesContent+= (`
                          <div class="d-flex justify-content-around mx-1 my-1">
                              <a class="card-link btn btn-info" href="/services/`+this.suppID+`/edit?service_type=supply"><i class="fas fa-edit"></i></a>
                              <a class="card-link btn btn-secondary" href="/services/`+this.suppID+`/supply"><i class="fas fa-copy"></i></a>
                              <form class="d-inline" action="/services/`+this.suppID+`?_method=DELETE" method="POST">
                                  <button class="btn btn-danger"><i class="fas fa-trash"></i></button>
                              </form>
                          </div>`);
                          }
              }
              suppliesContent+= (`</div>
                               </div>`);
          
               });
               suppliesContent+=`</div>`
               let pagination = `<div class="row my-3 pagination customClass">
                  <div class="btn-group float-right" role="group" aria-label="First group">`;

                if (response.page > 1) {
                  pagination += `<a data-page="${response.page - 1}" class="btn btn-light pagination-button" role="button" aria-pressed="true"><i class="fas fa-arrow-circle-left"></i></a>`;
                }

                for (let step = 1; step < response.pages + 1; step++) {
                  let act = (step == response.page) ? "active" : "";
                  pagination += `<a data-page="${step}" class="btn btn-light pagination-button ${act}" role="button" aria-pressed="true">${step}</a>`;
                }

                if (response.page + 1 <= response.pages) {
                  pagination += `<a data-page="${response.page + 1}" class="btn btn-light pagination-button" role="button" aria-pressed="true"><i class="fas fa-arrow-circle-right"></i></a>`;
                }

                pagination += `</div>
                  </div>`;
               $('.supplies').html(suppliesContent);  
               $('.pagination').replaceWith( pagination); 
               $("selector").find('option[value="'+response.sorted+'"]').attr('selected','selected');
               $("#search_val").val(response.search)
                 
 });
};

$(document).on('click', '.pagination-button', foundSupplies_existence);
$(document).on('click', '.pagination-button-normal', foundSupplies);




