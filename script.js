const hardDefinedBackgroundColors = [
    'rgba(255, 0, 212, 0.5)',
    'rgba(160, 0, 133, 0.5)',
    'rgba(156, 67, 141, 0.5)',
    'rgba(231, 137, 255, 0.5)',
    'rgba(199, 27, 226, 0.5)'
]
var currentChart = null;
document.getElementById("fileInput").addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        console.log('File selected:', file.name);
        onFileUpload(file);
    }
});


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
        alert("Unsupported extension!");
    }
}

function parseJSON(file)
{
    const reader = new FileReader();
    let labels = [];
    let values = [];

    reader.onload = function(event) {
        const fileContent = event.target.result;
        let name = '';  // variable to store the name
    
        try {
            const parsedData = JSON.parse(fileContent);
            console.log('Parsed JSON:', parsedData);
    
            // Extract the top-level 'name' field
            if (parsedData.name) {
                name = parsedData.name;
                console.log('Extracted name:', name);
            }
    
            // Function to recursively find all 'label' and 'value' pairs
            const findLabelsAndValues = (obj) => {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (key.toLowerCase() === 'label' && obj[key]) {
                            labels.push(obj[key]);
                        }
                        if (key.toLowerCase() === 'value' && typeof obj[key] === 'number') {
                            values.push(obj[key]);
                        }
                        if (typeof obj[key] === 'object' || Array.isArray(obj[key])) {
                            findLabelsAndValues(obj[key]);
                        }
                    }
                }
            };
    
            // Start recursive search
            findLabelsAndValues(parsedData);
    
            generateGraph(labels, values, name);
    
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
    fileContent = String(fileContent);
    const rows = fileContent.split('\n');
    var labels = [];
    var values = [];
    let name = null;

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
        if(isFinite(columns[1]) || isFinite(columns[0]))
        {
            labels.push(columns[0]);
            values.push(columns[1]);
        }
        else if(columns[0].toLowerCase() == "name")
        {
            name = columns[1];
        }
        else if(columns[1].toLowerCase() == "name")
        {
            name = columns[0];
        }
        console.log(`Row ${index + 1}:`, columns);
    });
    if(name)
    {
        generateGraph(labels, values, name);
    }
    else
    {
        generateGraph(labels, values);
    }
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
                        else if(!value)
                        {
                            if(isFinite(element[key].text))
                            {
                                value = element[key].text;
                            }
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
        if(name)
        {
            generateGraph(labels, values, name);
        }
        else
        {
            generateGraph(labels, values);
        }
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
    };

    reader.readAsText(file);
}



function generateGraph(labels = [], data = [], name = "Unknown Chart", graphType = "line")
{
    var uploadButton = document.getElementById("uploadButton");
    uploadButton.style.width = "250px";
    uploadButton.textContent = "Vyberte nový soubor";
    
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
    
    var hiddenGraphics = document.getElementsByClassName("upload-graphics-hide")[0];
    if(hiddenGraphics)
    {
        hiddenGraphics.remove();
    }

    if(graphType == "line")
    {
        // Create a new chart - line
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
                backgroundColor: 'rgb(255, 0, 212)',
                tension: 0.1
            }]
            },
            options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: "#595959"
                    }
                },
                x: {
                    beginAtZero: false,
                    grid: {
                        color: "#595959"
                    }
                }
            }
            }
        });
    }
    else if(graphType == "bar")
    {
        // Create a new chart - bar
        var newChart = new Chart(ctx, {
            type: 'bar',
            data: {
            labels: labels,
            datasets: [{
                label: name,
                data: data,
                borderColor: 'rgb(255, 0, 212)',
                barThickness: 100,
                barPercentage: 0.5,
                tension: 0.1,
                backgroundColor: 'rgb(255, 0, 212)'
            }]
            },
            options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                grid: {
                    color: "#595959"
                }
                },
                x: {
                grid: {
                    color: "#595959"
                }
                }
            }
            }
        });
    }
    else if(graphType == "doughnut")
    {
        // Create a new chart - doughnut
        var newChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
            labels: labels,
            datasets: [{
                label: name,
                data: data,
                borderColor: 'rgb(73, 42, 68)',
                barThickness: 100,
                barPercentage: 0.5,
                tension: 0.1,
                backgroundColor: getValidColors(labels.length)
            }]
            },
            options: {
            responsive: true,
            maintainAspectRatio: false,
            }
        });
    }
    else if(graphType == "polar")
    {
        // Create a new chart - Polar Area
        var newChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
            labels: labels,
            datasets: [{
                label: name,
                data: data,
                borderColor: 'rgb(73, 42, 68)',
                backgroundColor: getValidColors(labels.length)
            }]
            },
            options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    grid: {
                        color: "#595959"
                    }
                }
            }
            }
        });
    }
    else if(graphType == "radar")
    {
        // Create a new chart - Radar
        var newChart = new Chart(ctx, {
            type: 'radar',
            data: {
            labels: labels,
            datasets: [{
                label: name,
                data: data,
                borderColor: 'rgb(73, 42, 68)',
                backgroundColor: 'rgba(255, 0, 212, 0.5)',
                pointBackgroundColor: 'rgb(255, 255, 255)'
            }]
            },
            options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    grid: {
                        color: "#595959"
                    },
                    angleLines: {
                        color: "#595959"
                    }
                }
            }
            }
        });
    }

    currentChart = newChart;
}

function getValidColors(numberOfNames)
{
    let validColors = hardDefinedBackgroundColors;
    if((numberOfNames - 1) % hardDefinedBackgroundColors.length == 0)
    {
        validColors.pop();
    }
    return validColors;
}

document.getElementById("uploadButton").addEventListener("click", function() {
    document.getElementById("fileInput").click();
});