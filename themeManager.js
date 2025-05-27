var sidebarState = true;
var currentSiteTheme = localStorage.getItem("currentSiteTheme") ?? 0;
var currentGraphTheme = localStorage.getItem("currentGraphTheme") ?? 0;
var root = document.querySelector(':root');
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
    root.style.setProperty('--color-text-primary', getSiteColor(0));
    root.style.setProperty('--color-text-secondary', getSiteColor(1));
    root.style.setProperty('--color-text-tertiary', getSiteColor(2));
    root.style.setProperty('--color-text-h2', getSiteColor(3));
    root.style.setProperty('--color-text-h3', getSiteColor(4));
    root.style.setProperty('--color-background-primary', getSiteColor(5));
    root.style.setProperty('--color-background-secondary', getSiteColor(6));
    root.style.setProperty('--color-teoria-alert-bg', getSiteColor(7));
    root.style.setProperty('--color-teoria-example-bg', getSiteColor(8));
    root.style.setProperty('--color-teoria-definition-bg', getSiteColor(9));
    root.style.setProperty('--color-teoria-definition-outline', getSiteColor(10));
    root.style.setProperty('--color-button-primary', getSiteColor(11));
    root.style.setProperty('--color-button-secondary', getSiteColor(12));
    root.style.setProperty('--color-button-hover', getSiteColor(13));
    root.style.setProperty('--color-button-outline', getSiteColor(14));
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