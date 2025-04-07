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
    let labels = [];
    let values = [];

    reader.onload = function(event) {
        const fileContent = event.target.result;
        try {
            const parsedData = JSON.parse(fileContent);
            console.log('Parsed JSON:', parsedData);
            
            // Function to recursively find all 'label' and 'value' pairs
            const findLabelsAndValues = (obj) => {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        // If the current key is 'label' and the value is not empty, push it
                        if (key.toLowerCase() === 'label' && obj[key]) {
                            labels.push(obj[key]);
                        }
                        // If the current key is 'value' and the value is a number, push it
                        if (key.toLowerCase() === 'value' && typeof obj[key] === 'number') {
                            values.push(obj[key]);
                        }
                        // Recursively search in nested objects or arrays
                        if (typeof obj[key] === 'object' || Array.isArray(obj[key])) {
                            findLabelsAndValues(obj[key]);
                        }
                    }
                }
            };

            // Start recursive search
            findLabelsAndValues(parsedData);

            
            // Function to generate graph (just a placeholder for your graph generation logic)
            generateGraph(labels, values)
        } catch (e) {
            console.error('Failed to parse JSON:', e);
        }
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
    };

    // Read the file content (this assumes 'file' is the input file object)
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

function parseXML(file) {
    const reader = new FileReader();
    var labels = [];
    var values = [];

    reader.onload = function(event) {
        const fileContent = event.target.result;

        const parser = new DOMParser();
        const doc = parser.parseFromString(fileContent, "text/xml");

        // Recursively parse the XML document
        function traverseNode(node) {
            const nodeData = {};

            if (node.nodeType === Node.ELEMENT_NODE) {
                // Process the current node if it's an element node
                Array.from(node.childNodes).forEach(childNode => {
                    if (childNode.nodeType === Node.ELEMENT_NODE) {
                        // Recursive call for child elements
                        const childData = traverseNode(childNode);
                        // If the child node has no name or is nested, store it as an array or object
                        if (nodeData[childNode.tagName]) {
                            // If there are already entries for this tag, store them as an array
                            if (Array.isArray(nodeData[childNode.tagName])) {
                                nodeData[childNode.tagName].push(childData);
                            } else {
                                nodeData[childNode.tagName] = [nodeData[childNode.tagName], childData];
                            }
                        } else {
                            nodeData[childNode.tagName] = childData;
                        }
                    } else if (childNode.nodeType === Node.TEXT_NODE) {
                        // Capture the text content if it's a text node
                        const textContent = childNode.nodeValue.trim();
                        if (textContent) {
                            nodeData['text'] = textContent;
                        }
                    }
                });
            }

            return nodeData;
        }

        // Start traversal from the root element of the XML document
        const parsedData = traverseNode(doc.documentElement);

        console.log(parsedData);

        for(const [key, value] of Object.entries(parsedData)) {
            value.forEach(element => {
                var label = null;
                var value = null;
                for(const key in element)
                {
                    if(element[key].hasOwnProperty('text')) {
                        if(!label)
                        {
                            label = element[key].text;
                        }
                        else
                        {
                            value = element[key].text;
                        }
                    }
                }
                labels.push(label);
                values.push(value);
            });
        }

        const allElements = doc.querySelectorAll('*');

        // Iterate through all elements and check for the 'name' attribute
        let name = null;

        allElements.forEach(element => {
            // Check if the element has a 'name' attribute
            if (element.hasAttribute('name')) {
                name = element.getAttribute('name');
                return;  // Exit loop early if the 'name' attribute is found
            }
        });
        generateGraph(labels, values, name);
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
    };

    reader.readAsText(file);
}



function generateGraph(labels = [], data = [], name = "Unknown Chart")
{
    const canvasDiv = document.getElementById('canvasDiv');
    const canvas = document.getElementById("myChart");
    
    canvasDiv.width = window.innerWidth;
    canvasDiv.height = window.innerHeight;
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.5;
    canvasDiv.style.contentVisibility = "visible";
    canvasDiv.style.marginBottom = "50px";

    var ctx = canvas.getContext('2d');

    if(currentChart)
    {
        currentChart.destroy();
    }

    document.getElementsByClassName("upload-graphics-hide")[0].style.visibility = "hidden";
    document.getElementById("uploadButton").textContent = "Select new file";
  
    // Create a new chart
    var newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: name,
          data: data,
          borderColor: 'rgb(73, 42, 68)',
          pointBorderColor: 'rgb(255, 0, 212)',
          pointBorderWidth: 3,
          pointBackgroundColor: 'rgb(255, 0, 212)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
