var sidebarState = true;
var currentSiteTheme = localStorage.getItem("currentSiteTheme") ?? 0;
var currentGraphTheme = localStorage.getItem("currentGraphTheme") ?? 0;
var root = document.querySelector(':root');
const overridableVars = [
    "--color-text-primary",
    "--color-text-secondary",
    "--color-text-tertiary",
    "--color-text-h2",
    "--color-text-h3",
    "--color-background-primary",
    "--color-background-secondary",
    "--color-teoria-alert-bg",
    "--color-teoria-example-bg",
    "--color-teoria-definition-bg",
    "--color-teoria-definition-outline",
    "--color-button-primary",
    "--color-button-secondary",
    "--color-button-hover",
    "--color-button-outline",
    "--color-popup-bg",
    "--color-popup-outline",
    "--color-popup-header",
    "--color-popup-text",
    "--color-popup-extra",
    "--color-request-bg",
    "--color-request-outline",
    "--color-request-header",
    "--color-request-text",
    "--color-request-button-should-bg",
    "--color-request-button-should-outline",
    "--color-request-button-should-text",
    "--color-request-button-should-hover",
    "--color-request-button-bg",
    "--color-request-button-outline",
    "--color-request-button-text",
    "--color-request-button-hover",
    "--color-filetype-csv",
    "--color-filetype-json",
    "--color-filetype-xml"
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