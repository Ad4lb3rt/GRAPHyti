var sidebarState = true;
var currentSiteTheme = localStorage.getItem("currentSiteTheme") ?? 0;
var currentGraphTheme = localStorage.getItem("currentGraphTheme") ?? 0;
var root = document.querySelector(':root');
const overridableVars = [
    "--color-text-primary",
]
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
    for(let i = 0; i < overridableVars.length; i++)
    {
        root.style.setProperty(overridableVars[i], getSiteColor(i));
    }
}

function changeGraphTheme(buttonIndex)
{
    localStorage.setItem("currentGraphTheme", buttonIndex);
    currentGraphTheme = buttonIndex;
}

function getCurrentSiteThemeIndex()
{
    return localStorage.getItem("currentSiteTheme");
}