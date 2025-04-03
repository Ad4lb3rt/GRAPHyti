var currentChart = null;

if(window.location.href == window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/index.html")
{
    document.getElementById("fileInput").addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
            onFileUpload(file);
        }
    });
}

function onFileUpload(file)
{
    console.log(file);
    if(!(file instanceof File))
    {
        console.error("onFileUpload didn't receive correct variable type!");
        return;
    }
    const f = String(file.name);
    const extension = f.split('.').pop();
    console.log(extension);
    if(extension == "json")
    {
        parseJSON(file);
    }
    else if(extension == "csv")
    {
        parseCSVIntoContent(file);
    }
    else if(extension == "xml")
    {
        parseXML(file);
    }
    else
    {
        console.error("Unsupported extension!");
    }
}

function parseJSON(file)
{
    const reader = new FileReader();
    var labels = [];
    var values = [];

    reader.onload = function(event) {
        const fileContent = event.target.result
        try {
            const parsedData = JSON.parse(fileContent);
            console.log('Parsed JSON:', parsedData);
            parsedData.data.forEach(element => {
                labels.push(element.label);
                values.push(element.value);
            });
            generateGraph(labels, values);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
        }
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
    };

    reader.readAsText(file);
}

function parseCSVIntoContent(file)
{
    const reader = new FileReader();

    reader.onload = function(event) {
        const fileContent = event.target.result;
        parseCSV(fileContent);
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
    };
    reader.readAsText(file);
}

function parseCSV(fileContent)
{
    fileContent = String(fileContent)
    const rows = fileContent.split('\n');
    var labels = [];
    var values = [];

    rows.forEach((row, index) => {
        var columns = "";
        if(row.includes(";"))
        {
            columns = row.split(';');   
        }
        else
        {
            columns = row.split(",");
        }
        columns[1] = columns[1].replace(/\r/g, '');
        labels.push(columns[0]);
        values.push(columns[1]);
        console.log(`Row ${index + 1}:`, columns);
    });
    generateGraph(labels, values);
}

function parseXML(file)
{
    const reader = new FileReader();

    reader.onload = function(event) {
        const fileContent = event.target.result;

        const parser = new DOMParser();
        const doc = parser.parseFromString(fileContent, "text/xml");

        const heading = doc.getElementsByTagName("heading")[0]?.childNodes[0]?.nodeValue;
        
        console.log(heading);
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
    };

    reader.readAsText(file);
}

function generateGraph(labels = [], data = [])
{
    // Get the context of the canvas element we want to select
    var ctx = document.getElementById('myChart').getContext('2d');

    if(currentChart)
    {
        currentChart.destroy();
    }
  
    // Create a new chart
    var newChart = new Chart(ctx, {
      type: 'line', // Define chart type, e.g., line, bar, pie, etc.
      data: {
        labels: labels, // X-axis labels
        datasets: [{
          label: 'My First Dataset',
          data: data, // Y-axis data points
          borderColor: 'rgb(75, 192, 192)', // Line color
          tension: 0.1 // Line tension
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    currentChart = newChart;
}

if(window.location.href == window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/index.html")
{
    document.getElementById("uploadButton").addEventListener("click", function() {
        document.getElementById("fileInput").click();
    });
}
