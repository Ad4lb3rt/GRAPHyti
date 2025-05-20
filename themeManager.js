var sidebarState = true;

toggleSidebar();

var currentSiteTheme = localStorage.getItem("currentSiteTheme") ?? 0;
var currentGraphTheme = localStorage.getItem("currentGraphTheme") ?? 0;

window.addEventListener("load", (event) => {
    var siteTheme = document.getElementsByClassName("website-theme-button")[currentSiteTheme];
    siteTheme.checked = "true";
    siteTheme.click();

    var graphTheme = document.getElementsByClassName("graph-theme-button")[currentGraphTheme];
    graphTheme.checked = "true";
    graphTheme.click();
});

function toggleSidebar()
{
    sidebarState = !sidebarState;
    document.getElementsByClassName("side-menu")[0].style.display = sidebarState == true ? "block" : "none";
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