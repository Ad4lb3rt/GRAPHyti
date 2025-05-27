const siteThemeColors = [

    /* Order of parameters 
    1 - --color-text-primary
    2 - --color-text-secondary
    3 - --color-text-tertiary
    4 - --color-text-h2
    5 - --color-text-h3
    6 - --color-background-primary
    7 - --color-background-secondary
    8 - --color-teoria-alert-bg
    9 - --color-teoria-example-bg
    10 - --color-teoria-definition-bg
    11 - --color-teoria-definition-outline
    12 - --color-button-primary
    13 - --color-button-secondary
    14 - --color-button-hover
    15 - --color-button-outline
    */
    
    [   
        "rgb(255, 193, 252)", 
        "rgb(169, 103, 228)", 
        "rgb(166, 154, 168)", 
        "rgb(124, 89, 165)", 
        "rgb(105, 77, 136)", 
        "rgb(16, 14, 16)",
        "rgba(117, 64, 106, 0.3)",
        "rgba(169, 103, 228, 0.15)", 
        "rgba(117, 64, 106, 0.15)", 
        "rgba(71, 52, 52, 0.2)", 
        "rgba(114, 93, 93, 0.2)", 
        "rgb(28, 28, 32)", 
        "rgb(21, 21, 24)", 
        "rgb(48, 36, 48)", 
        "rgb(71, 52, 71)"
    ],

    [   
        "rgb(32, 32, 24)", 
        "rgb(123, 10, 221)", 
        "rgb(83, 67, 40)",
        "rgb(124, 89, 165)", 
        "rgb(105, 77, 136)", 
        "rgb(230, 206, 167)",
        "rgba(133, 97, 0, 0.3)",
        "rgba(169, 103, 228, 0.15)", 
        "rgba(117, 64, 106, 0.15)", 
        "rgba(71, 52, 52, 0.2)", 
        "rgba(114, 93, 93, 0.2)", 
        "rgb(28, 28, 32)", 
        "rgb(21, 21, 24)", 
        "rgb(48, 36, 48)", 
        "rgb(71, 52, 71)"
    ],

    [   
        "rgb(255, 193, 252)", 
        "rgb(169, 103, 228)", 
        "rgb(166, 154, 168)", 
        "rgb(124, 89, 165)", 
        "rgb(105, 77, 136)", 
        "rgb(16, 14, 16)",
        "rgba(117, 64, 106, 0.3)",
        "rgba(169, 103, 228, 0.15)", 
        "rgba(117, 64, 106, 0.15)", 
        "rgba(71, 52, 52, 0.2)", 
        "rgba(114, 93, 93, 0.2)", 
        "rgb(28, 28, 32)", 
        "rgb(21, 21, 24)", 
        "rgb(48, 36, 48)", 
        "rgb(71, 52, 71)"
    ],

    [   
        "rgb(255, 193, 252)", 
        "rgb(169, 103, 228)", 
        "rgb(166, 154, 168)", 
        "rgb(124, 89, 165)", 
        "rgb(105, 77, 136)", 
        "rgb(16, 14, 16)",
        "rgba(117, 64, 106, 0.3)",
        "rgba(169, 103, 228, 0.15)", 
        "rgba(117, 64, 106, 0.15)", 
        "rgba(71, 52, 52, 0.2)", 
        "rgba(114, 93, 93, 0.2)", 
        "rgb(28, 28, 32)", 
        "rgb(21, 21, 24)", 
        "rgb(48, 36, 48)", 
        "rgb(71, 52, 71)"
    ],

    [   
        "rgb(255, 193, 252)", 
        "rgb(169, 103, 228)", 
        "rgb(166, 154, 168)", 
        "rgb(124, 89, 165)", 
        "rgb(105, 77, 136)", 
        "rgb(16, 14, 16)",
        "rgba(117, 64, 106, 0.3)",
        "rgba(169, 103, 228, 0.15)", 
        "rgba(117, 64, 106, 0.15)", 
        "rgba(71, 52, 52, 0.2)", 
        "rgba(114, 93, 93, 0.2)", 
        "rgb(28, 28, 32)", 
        "rgb(21, 21, 24)", 
        "rgb(48, 36, 48)", 
        "rgb(71, 52, 71)"
    ],

    [   
        "rgb(255, 193, 252)", 
        "rgb(169, 103, 228)", 
        "rgb(166, 154, 168)", 
        "rgb(124, 89, 165)", 
        "rgb(105, 77, 136)", 
        "rgb(16, 14, 16)",
        "rgba(117, 64, 106, 0.3)",
        "rgba(169, 103, 228, 0.15)", 
        "rgba(117, 64, 106, 0.15)", 
        "rgba(71, 52, 52, 0.2)", 
        "rgba(114, 93, 93, 0.2)", 
        "rgb(28, 28, 32)", 
        "rgb(21, 21, 24)", 
        "rgb(48, 36, 48)", 
        "rgb(71, 52, 71)"
    ]
];

function getSiteColor(colorIndex)
{
    return siteThemeColors[getCurrentSiteThemeIndex()][colorIndex];
}