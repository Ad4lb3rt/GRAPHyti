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
        console.error("Unsupported extension!");
    }
}

function parseJSON(file)
{
    const reader = new FileReader();

    reader.onload = function(event) {
        const fileContent = event.target.result
        try {
            const parsedData = JSON.parse(fileContent);
            console.log('Parsed JSON:', parsedData);
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

    rows.forEach((row, index) => {
        const columns = row.split(';');

        console.log(`Row ${index + 1}:`, columns);
    });
}

function parseXML(file)
{
    const reader = new FileReader();
    var text = "";

    reader.onload = function(event) {
        const fileContent = event.target.result;
        text = fileContent;
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
    };
    reader.readAsText(file);
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/xml");
    console.log(doc.documentElement.nodeName);
}

document.addEventListener("DOMContentLoaded", function() {
    //menicko
    const menuBtn = document.querySelector(".menu-btn");
    const menu = document.querySelector(".menu");

    menuBtn.addEventListener("click", function() {
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function(event) {
        if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
            menu.style.display = "none";
        }
    });

    // přepinac
    const uploadBtn = document.querySelector(".upload-btn");
    const uploadOptions = document.querySelector(".upload-options");

    uploadBtn.addEventListener("click", function(event) {
        event.stopPropagation(); 
        uploadOptions.style.display = (uploadOptions.style.display === "block") ? "none" : "block";
    });

    document.addEventListener("click", function(event) {
        if (!uploadBtn.contains(event.target) && !uploadOptions.contains(event.target)) {
            uploadOptions.style.display = "none";
        }
    });

    // "Nahrát z PC"
    const uploadFromPcBtn = document.querySelector('.upload-options li:first-child a');
    uploadFromPcBtn.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('fileInput').click();
    });
});