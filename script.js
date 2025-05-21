const hardDefinedBackgroundColors = [
    'rgba(255, 0, 212, 0.5)',
    'rgba(160, 0, 133, 0.5)',
    'rgba(156, 67, 141, 0.5)',
    'rgba(231, 137, 255, 0.5)',
    'rgba(199, 27, 226, 0.5)'
]
var currentChart = null;
const menuScreen = document.getElementsByClassName("upload")[0];
const settingsScreen = document.getElementsByClassName("graph-settings-wrapper")[0];
settingsScreen.style.display = "none";
var topResult = document.getElementById("dropdown-select").getElementsByTagName("a")[0];
var highlighted = [true, false, false, false, false];
var searching = false;
const errorPopup = document.getElementsByClassName("popup")[0];
const errorDetailsPopup = document.getElementsByClassName("popup-details")[0];
const warningPopup = document.getElementsByClassName("accept-request")[0];
const siteHeader = document.getElementsByClassName("header")[0];
var cachedGraphSettings = null;
var cachedErrorDetails = null;
var sidebarState = true;
var currentSiteTheme = localStorage.getItem("currentSiteTheme") ?? 0;
var currentGraphTheme = localStorage.getItem("currentGraphTheme") ?? 0;
fetch("side_menu.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("side-menu-placeholder").innerHTML = html;
        toggleSidebar();
        var siteTheme = document.getElementsByClassName("website-theme-button")[currentSiteTheme];
        siteTheme.checked = "true";
        siteTheme.click();

        var graphTheme = document.getElementsByClassName("graph-theme-button")[currentGraphTheme];
        graphTheme.checked = "true";
        graphTheme.click();
    });
filterFunction();
closeError();

document.getElementById("fileInput").addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        console.log('File selected:', file.name);
        parseFile(file);
    }
});

<<<<<<< Updated upstream
window.addEventListener("load", (event) => {
    var siteTheme = document.getElementsByClassName("website-theme-button")[currentSiteTheme];
    siteTheme.checked = "true";
    siteTheme.click();

    var graphTheme = document.getElementsByClassName("graph-theme-button")[currentGraphTheme];
    graphTheme.checked = "true";
    graphTheme.click();
});

//TO-DO: Side menu should be added to page tree via js to preserve newly added elements to all html pages without the need to change them one by one

=======
>>>>>>> Stashed changes
function parseFile(file)
{
    const f = String(file.name);
    const extension = f.split('.').pop();
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
        showError("Neplatný soubor!", "Tento soubor nepodporujeme! Podporované soubory mají koncovku .csv, .json, nebo .xml!")
    }
}

function parseJSON(file)
{
    const reader = new FileReader();
    let labels = [];
    let values = [];

    reader.onload = function(event) {
        const fileContent = event.target.result;
        let name = null;  // variable to store the name
    
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
            
            if(name)
            {
                cachedGraphSettings = new GraphSettings(labels, values, name, undefined);
            }
            else
            {
                cachedGraphSettings = new GraphSettings(labels, values, undefined, undefined);
            }
            checkForWarnings();
    
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            showError("Chyba při analýze souboru!", "Váš JSON soubor je pravděpodobně poškozený. Zkontrolujte ho a zkuste to znovu!", e);
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

    for (let index = 0; index < rows.length; index++)
    {
        const row = rows[index];
        let columns = [];

        if (row.includes(";"))
        {
            columns = row.split(';');   
        }
        else 
        {
            columns = row.split(",");
        }

        try
        {
            columns[1] = columns[1].replace(/\r/g, '');
        }
        catch(e)
        {
            console.error('Failed to parse CSV:', e);
            showError("Chyba při analýze souboru!", "Váš CSV soubor je pravděpodobně poškozený. Zkontrolujte ho a zkuste to znovu!", e);
            return;
        }

        if (isFinite(columns[1]) || isFinite(columns[0])) 
        {
            labels.push(columns[0]);
            values.push(columns[1]);
        }
        else if (columns[0].toLowerCase() === "name")
        {
            name = columns[1];
        }
        else if (columns[1].toLowerCase() === "name")
        {
            name = columns[0];
        }

        console.log(`Row ${index + 1}:`, columns);
    }

    if(name)
    {
        cachedGraphSettings = new GraphSettings(labels, values, name, undefined);
    }
    else
    {
        cachedGraphSettings = new GraphSettings(labels, values, undefined, undefined);
    }

    checkForWarnings();
}


function parseXML(file) {
    const reader = new FileReader();
    var labels = [];
    var values = [];

    reader.onload = function(event) {
        const fileContent = event.target.result;

        const parser = new DOMParser();
        const doc = parser.parseFromString(fileContent, "text/xml");

        // Handle parsing errors
        if (doc.getElementsByTagName("parsererror").length > 0) {
            console.error("Failed to parse XML: " + doc.getElementsByTagName("parsererror")[0].textContent);
            showError("Chyba při analýze souboru!", "Váš XML soubor je pravděpodobně poškozený. Zkontrolujte ho a zkuste to znovu!", doc.getElementsByTagName("parsererror")[0].textContent);
            return;
        }


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
            cachedGraphSettings = new GraphSettings(labels, values, name, undefined);
        }
        else
        {
            cachedGraphSettings = new GraphSettings(labels, values, undefined, undefined);
        }
        checkForWarnings();
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
    };

    reader.readAsText(file);
}

function checkForWarnings()
{
    if(cachedGraphSettings.labels.length > 100)
    {
        showWarning("Varování", "Váš soubor přesahuje náš doporučený objem dat, konkrétně obsahuje:\r\n\r\n" + cachedGraphSettings.labels.length + " hodnot!\r\n\r\nTo může mít za následek pomalejší rychlost stránky, sekání, zmražení obrazu\r\n a/nebo méně čitelnější výsledný graf.");
    }
    else
    {
        openSettingsMenu();
    }
}

function openSettingsMenu()
{
    searching = true;
    warningPopup.style.display = "none";
    menuScreen.style.display = "none";
    moveUpInTree(settingsScreen);
    settingsScreen.style.display = "flex";
    document.getElementById("graphTypeInput").focus();
}

function selectGraphType(type)
{
    searching = false;
    cachedGraphSettings.graphType = type;
    menuScreen.style.display = "flex";
    moveUpInTree(menuScreen);
    settingsScreen.style.display = "none";
    document.getElementById("graphTypeInput").value = null;
    filterFunction();
    generateGraph(cachedGraphSettings);
}

function generateGraph(graphSettings)
{
    var uploadButton = document.getElementById("uploadButton");
    const graphType = graphSettings.graphType;
    uploadButton.style.width = "250px";
    uploadButton.textContent = "Vybrat nový soubor";
    var uploadButtonImage = document.createElement('img');
    uploadButtonImage.src = "resources/svgs/openfile.svg";
    uploadButton.insertBefore(uploadButtonImage, uploadButton.firstChild);
    if(!document.getElementById("retryButton"))
    {
        retryButton = uploadButton.cloneNode(true);
        retryButton.textContent = "Vybrat jiný typ grafu"
        retryButton.style.width = "265px";
        retryButton.id = "retryButton";
        retryButton.style.marginLeft = "25px";
        retryButton.onclick = openSettingsMenu;
        var retryButtonImage = document.createElement('img');
        retryButtonImage.src = "resources/svgs/switch.svg";
        retryButton.insertBefore(retryButtonImage, retryButton.firstChild);
        uploadButton.after(retryButton);
    }
    
    const canvasDiv = document.getElementById('canvasDiv');
    const canvas = document.getElementById("myChart");
    
    canvasDiv.width = window.innerWidth;
    canvasDiv.height = window.innerHeight;
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
    canvasDiv.style.display = "flex";
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
            labels: graphSettings.labels,
            datasets: [{
                label: graphSettings.name,
                data: graphSettings.data,
                borderColor: 'rgb(73, 42, 68)',
                pointBorderColor: 'rgb(255, 0, 212)',
                pointBorderWidth: 4,
                pointBackgroundColor: 'rgb(255, 0, 212)',
                pointHoverBackgroundColor: 'rgb(255, 255, 255)',
                pointHoverRadius: 10,
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
            labels: graphSettings.labels,
            datasets: [{
                label: graphSettings.name,
                data: graphSettings.data,
                borderColor: 'rgb(255, 0, 212)',
                barThickness: 100,
                barPercentage: 0.5,
                tension: 0.1,
                backgroundColor: hardDefinedBackgroundColors
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
            labels: graphSettings.labels,
            datasets: [{
                label: graphSettings.name,
                data: graphSettings.data,
                borderColor: 'rgb(73, 42, 68)',
                barThickness: 100,
                barPercentage: 0.5,
                tension: 0.1,
                backgroundColor: getValidColors(graphSettings.labels.length),
                hoverBorderWidth: 5,
                hoverOffset: 2
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
            labels: graphSettings.labels,
            datasets: [{
                label: graphSettings.name,
                data: graphSettings.data,
                borderColor: 'rgb(73, 42, 68)',
                backgroundColor: getValidColors(graphSettings.labels.length),
                hoverBorderWidth: 5
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
            labels: graphSettings.labels,
            datasets: [{
                label: graphSettings.name,
                data: graphSettings.data,
                borderColor: 'rgb(73, 42, 68)',
                backgroundColor: 'rgba(255, 0, 212, 0.5)',
                pointRadius: 5,
                pointBackgroundColor: 'rgb(255, 255, 255)',
                pointHoverBackgroundColor: 'rgb(255, 255, 255)',
                pointHoverRadius: 10,
                pointBorderWidth: 4
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
                    },
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

function filterFunction()
{
    const input = document.getElementById("graphTypeInput");
    const filter = input.value.toUpperCase();
    const div = document.getElementById("dropdown-select");
    const a = div.getElementsByTagName("a");
    for(let i = 0; i < a.length; i++) {
        var txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1)
        {
            a[i].style.filter = "none";
            a[i].style.opacity = "1";
            highlighted[i] = true;
        } 
        else
        {
            a[i].style.filter = "blur(4px)";
            a[i].style.opacity = "0.6";
            highlighted[i] = false;
        }
    }

    if(!highlighted.some(x => x == true))
    {
        highlighted[0] = true;
    }
    
    if(filter == "")
    {
        topResult = a[0];
        topResult.style.backgroundColor = "rgb(64, 64, 73)";
        for(let j = 0; j < a.length; j++)
        {
            if(a[j] != topResult)
            {
                a[j].style.backgroundColor = "rgb(28, 28, 32)";
            }
        }
        return;
    }

    for(let i = 0; i < a.length; i++)
    {
        console.log(a[i].textContent + ": " +  highlighted[i]);
        if(highlighted[i])
        {
            topResult = a[i];
            topResult.style.backgroundColor = "rgb(64, 64, 73)";
            for(let j = 0; j < a.length; j++)
            {
                if(a[j] != topResult)
                {
                    a[j].style.backgroundColor = "rgb(28, 28, 32)";
                }
            }
            return;
        }
    }
    topResult = a[0];
}


function moveUpInTree(element)
{
    element.parentNode.insertBefore(element, element.previousElementSibling);
}

function showError(errorHeader, errorMessage, errorDetails)
{
    errorPopup.style.display = "block";
    document.getElementById("popup-header").textContent = errorHeader;
    document.getElementById("popup-message").textContent = errorMessage;

    if (typeof errorDetails === "undefined")
    {
        document.getElementById("popup-show-details").style.display = "none";
        cachedErrorDetails = null;
    }
    else
    {
        document.getElementById("popup-show-details").style.display = "block";
        cachedErrorDetails = errorDetails;
    }
    moveUpInTree(errorPopup);
    moveUpInTree(siteHeader);
    closeSidebar();
}


function closeError()
{
    errorPopup.style.display = "none";
}

function showErrorDetails()
{
    errorDetailsPopup.style.display = "block";
    document.getElementById("popup-details-message").textContent = cachedErrorDetails;
}

function closeErrorDetails()
{
    errorDetailsPopup.style.display = "none";
}

function showWarning(warningHeader, warningMessage)
{
    menuScreen.style.display = "none";
    warningPopup.style.display = "block";
    document.getElementById("accept-header").textContent = warningHeader;
    document.getElementById("accept-message").textContent = warningMessage;
    closeSidebar();
}

function refreshSite()
{
    location.reload();
}

function toggleSidebar()
{
    sidebarState = !sidebarState;
    document.getElementsByClassName("side-menu")[0].style.display = sidebarState == true ? "block" : "none";
    closeError();
}

function closeSidebar()
{
    sidebarState = false;
    document.getElementsByClassName("side-menu")[0].style.display = "none";
}

function changeSiteTheme(buttonIndex)
{
    localStorage.setItem("currentSiteTheme", buttonIndex);
    currentSiteTheme = buttonIndex;
}

function changeGraphTheme(buttonIndex)
{
    localStorage.setItem("currentGraphTheme", buttonIndex);
    currentGraphTheme = buttonIndex;
}

document.addEventListener("keydown", function(event) {
    if(event.key === "Enter" && searching)
    {
        topResult.click();
    }
});

document.getElementById("uploadButton").addEventListener("click", function() {
    document.getElementById("fileInput").click();
});

class GraphSettings
{
    constructor(labels = ["Label1", "Label2", "Label3"], data = [1, 2, 3], name = "Unknown Chart", graphType = "line")
    {
        this.labels = labels;
        this.data = data;
        this.name = name;
        this.graphType = graphType;
    }
}