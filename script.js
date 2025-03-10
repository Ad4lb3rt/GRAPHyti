const onedriveClientId = "88a7f8fb-128c-4f06-9f0d-465ada16d12e";
const redirectUri = "https://ad4lb3rt.github.io/GRAPHyti";
const scope = "Files.Read User.Read";

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

function signInToMicrosoft() {
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${onedriveClientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
}

function handleOAuthRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    if (authCode) {
        exchangeCodeForToken(authCode);
    }
}

function exchangeCodeForToken(authCode) {
    const clientSecret = "yLv8Q~FQrznOkMRikP.gJ5SDevjyFCT17OuTSb6I";
    const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
    const params = new URLSearchParams();
    params.append("client_id", onedriveClientId);
    params.append("client_secret", clientSecret);
    params.append("code", authCode);
    params.append("redirect_uri", redirectUri);
    params.append("grant_type", "authorization_code");
  
    fetch(tokenUrl, {
      method: "POST",
      body: params,
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.access_token) {
            const accessToken = data.access_token; // Save the access token
            console.log("Access Token:", accessToken);
            // Now you can use this token to make API requests to OneDrive
            getFilesFromOneDrive(accessToken);
        } else {
            console.error("Error: No access token returned.", data);
        }
    })
    .catch((error) => console.error("Error exchanging code for token:", error));
}

function getFilesFromOneDrive(accessToken) {
    const endpoint = "https://graph.microsoft.com/v1.0/me/drive/root/children"; // Get files from root directory
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
  
    fetch(endpoint, { headers })
      .then((response) => response.json())
      .then((data) => {
        console.log("Files:", data.value);
        displayFiles(data.value); // Display the files (you can choose how to display them)
      })
      .catch((error) => console.error("Error fetching files:", error));
}
  
// Display the files on your page
function displayFiles(files) {
const fileList = document.getElementById("fileList");
files.forEach((file) => 
    {
        const listItem = document.createElement("li");
        listItem.textContent = file.name;
        const downloadLink = document.createElement("a");
        downloadLink.href = file.webUrl;
        downloadLink.textContent = "Download";
        listItem.appendChild(downloadLink);
        fileList.appendChild(listItem);
    });
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


document.addEventListener("DOMContentLoaded", function() {

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

    // "Nahrát z OneDrive"
    const uploadFromOneDriveBtn = document.querySelector('.upload-options li:nth-child(3) a');
    uploadFromOneDriveBtn.addEventListener('click', function(event) {
        event.preventDefault();
        signInToMicrosoft();
    });

    // Call handleOAuthRedirect after page load to handle the redirect from the OAuth flow
    handleOAuthRedirect();
});