const siteThemeColors = [
    /* Order of parameters - 1 - primary color, 2 - background color, 3 - foreground color, 4 - outline color, 5- button hover color, 6 - inactive button color*/
    ["rgb(255, 193, 252)", "rgb(16, 14, 16)", "rgba(117, 64, 106, 0.308)", "rgb(71, 52, 71)", "rgb(32, 32, 36)", "rgb(28, 28, 32)"],
    ["rgb(179, 255, 0)", "rgb(16, 14, 16)", "rgba(117, 64, 106, 0.308)", "rgb(71, 52, 71)", "rgb(32, 32, 36)", "rgb(28, 28, 32)"],
    ["rgb(255, 193, 252)", "rgb(16, 14, 16)", "rgba(117, 64, 106, 0.308)", "rgb(71, 52, 71)", "rgb(32, 32, 36)", "rgb(28, 28, 32)"],
    ["rgb(255, 193, 252)", "rgb(16, 14, 16)", "rgba(117, 64, 106, 0.308)", "rgb(71, 52, 71)", "rgb(32, 32, 36)", "rgb(28, 28, 32)"],
    ["rgb(255, 193, 252)", "rgb(16, 14, 16)", "rgba(117, 64, 106, 0.308)", "rgb(71, 52, 71)", "rgb(32, 32, 36)", "rgb(28, 28, 32)"],
    ["rgb(255, 193, 252)", "rgb(16, 14, 16)", "rgba(117, 64, 106, 0.308)", "rgb(71, 52, 71)", "rgb(32, 32, 36)", "rgb(28, 28, 32)"],
    ["rgb(255, 193, 252)", "rgb(16, 14, 16)", "rgba(117, 64, 106, 0.308)", "rgb(71, 52, 71)", "rgb(32, 32, 36)", "rgb(28, 28, 32)"],
];

function getSiteColor(colorIndex)
{
    return siteThemeColors[getCurrentSiteThemeIndex()][colorIndex];
}