
-- Update Academic CV template with complete solid design
UPDATE resume_templates 
SET json_content = '{
  "theme": {
    "primaryColor": "#1e3a5f",
    "secondaryColor": "#4a6fa5",
    "accentColor": "#7c9ec9",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Georgia, serif"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "backgroundColor": "#ffffff",
        "borderBottom": "3px solid #1e3a5f",
        "color": "#1e3a5f",
        "fontSize": "2rem",
        "fontWeight": "700",
        "padding": "40px 50px 32px",
        "textAlign": "center",
        "fontFamily": "Georgia, serif",
        "letterSpacing": "1px",
        "titleFontSize": "1.125rem",
        "titleFontWeight": "400",
        "titleLetterSpacing": "2px",
        "titleTextTransform": "uppercase"
      }
    },
    {
      "id": "summary",
      "type": "summary",
      "style": {
        "padding": "28px 50px",
        "backgroundColor": "#f8fafc",
        "borderLeft": "4px solid #1e3a5f",
        "margin": "0 40px 24px",
        "fontStyle": "normal",
        "lineHeight": "1.6",
        "fontSize": "0.875rem"
      }
    },
    {
      "id": "education",
      "type": "education",
      "style": {
        "padding": "24px 50px",
        "borderTop": "1px solid #e2e8f0",
        "itemSpacing": "16px"
      }
    },
    {
      "id": "experience",
      "type": "experience",
      "style": {
        "padding": "24px 50px",
        "borderTop": "1px solid #e2e8f0",
        "itemSpacing": "20px",
        "divider": "1px solid #f1f5f9"
      }
    },
    {
      "id": "skills",
      "type": "skills",
      "style": {
        "padding": "24px 50px",
        "borderTop": "1px solid #e2e8f0",
        "display": "tags",
        "columns": 4
      }
    }
  ]
}'::jsonb,
description = 'Elegant academic format with serif typography, ideal for professors, researchers, and PhD candidates'
WHERE name = 'Academic CV';

-- Update Banking Professional template
UPDATE resume_templates 
SET json_content = '{
  "theme": {
    "primaryColor": "#064e3b",
    "secondaryColor": "#047857",
    "accentColor": "#10b981",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Arial, sans-serif"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "backgroundColor": "#064e3b",
        "color": "#ffffff",
        "fontSize": "2.25rem",
        "fontWeight": "700",
        "padding": "44px 48px",
        "textAlign": "left",
        "titleFontSize": "1.125rem",
        "titleOpacity": "0.9",
        "titleFontWeight": "400"
      }
    },
    {
      "id": "summary",
      "type": "summary",
      "style": {
        "backgroundColor": "#f0fdf4",
        "borderLeft": "5px solid #10b981",
        "padding": "28px 40px",
        "margin": "28px 40px",
        "lineHeight": "1.65",
        "fontSize": "0.9rem"
      }
    },
    {
      "id": "experience",
      "type": "experience",
      "style": {
        "padding": "28px 48px",
        "itemSpacing": "24px",
        "divider": "1px solid #e5e7eb"
      }
    },
    {
      "id": "bottom-grid",
      "type": "grid",
      "style": {
        "display": "grid",
        "gridTemplateColumns": "1fr 1fr",
        "gap": "40px",
        "padding": "28px 48px",
        "backgroundColor": "#f9fafb",
        "borderTop": "2px solid #10b981"
      },
      "children": [
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "display": "list",
            "listStyle": "none"
          }
        },
        {
          "id": "education",
          "type": "education"
        }
      ]
    }
  ]
}'::jsonb,
description = 'Conservative, professional design with green accents perfect for banking, finance, and investment sectors'
WHERE name = 'Banking Professional';

-- Update Corporate Standard template
UPDATE resume_templates 
SET json_content = '{
  "theme": {
    "primaryColor": "#1e293b",
    "secondaryColor": "#475569",
    "accentColor": "#64748b",
    "backgroundColor": "#ffffff",
    "textColor": "#0f172a",
    "fontFamily": "Inter, sans-serif"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "backgroundColor": "#1e293b",
        "color": "#ffffff",
        "fontSize": "2.125rem",
        "fontWeight": "700",
        "padding": "40px 48px",
        "textAlign": "left",
        "titleFontSize": "1.0625rem",
        "titleOpacity": "0.85",
        "titleFontWeight": "400",
        "letterSpacing": "0.5px"
      }
    },
    {
      "id": "summary",
      "type": "summary",
      "style": {
        "backgroundColor": "#ffffff",
        "padding": "28px 48px",
        "lineHeight": "1.7",
        "fontSize": "0.9rem",
        "borderBottom": "1px solid #e2e8f0"
      }
    },
    {
      "id": "experience",
      "type": "experience",
      "style": {
        "padding": "28px 48px",
        "itemSpacing": "24px",
        "divider": "1px solid #f1f5f9"
      }
    },
    {
      "id": "bottom-grid",
      "type": "grid",
      "style": {
        "display": "grid",
        "gridTemplateColumns": "1fr 1fr",
        "gap": "48px",
        "padding": "28px 48px",
        "backgroundColor": "#f8fafc",
        "borderTop": "3px solid #1e293b"
      },
      "children": [
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "display": "tags",
            "columns": 2
          }
        },
        {
          "id": "education",
          "type": "education"
        }
      ]
    }
  ]
}'::jsonb,
description = 'Modern corporate layout with clean lines and professional gray tones, ideal for business professionals'
WHERE name = 'Corporate Standard';

-- Update Executive Formal template
UPDATE resume_templates 
SET json_content = '{
  "theme": {
    "primaryColor": "#000000",
    "secondaryColor": "#d4af37",
    "accentColor": "#b8860b",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Georgia, serif"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "backgroundColor": "#000000",
        "borderBottom": "4px solid #d4af37",
        "color": "#ffffff",
        "fontSize": "2.5rem",
        "fontWeight": "700",
        "padding": "52px 48px",
        "textAlign": "center",
        "titleFontSize": "1.25rem",
        "titleFontWeight": "400",
        "titleOpacity": "0.9",
        "letterSpacing": "2px"
      }
    },
    {
      "id": "summary",
      "type": "summary",
      "style": {
        "backgroundColor": "#fafaf9",
        "borderTop": "3px solid #d4af37",
        "borderBottom": "3px solid #d4af37",
        "padding": "36px 56px",
        "margin": "0",
        "fontStyle": "italic",
        "lineHeight": "1.75",
        "fontSize": "0.95rem",
        "textAlign": "center"
      }
    },
    {
      "id": "experience",
      "type": "experience",
      "style": {
        "padding": "36px 56px",
        "itemSpacing": "28px",
        "divider": "1px solid #e5e7eb"
      }
    },
    {
      "id": "bottom-grid",
      "type": "grid",
      "style": {
        "display": "grid",
        "gridTemplateColumns": "1fr 1fr",
        "gap": "48px",
        "padding": "36px 56px",
        "backgroundColor": "#fafaf9",
        "borderTop": "2px solid #d4af37"
      },
      "children": [
        {
          "id": "education",
          "type": "education"
        },
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "display": "list",
            "listStyle": "none"
          }
        }
      ]
    }
  ]
}'::jsonb,
description = 'Sophisticated black and gold design for C-suite executives, senior directors, and board members'
WHERE name = 'Executive Formal';

-- Update Formal Document template
UPDATE resume_templates 
SET json_content = '{
  "theme": {
    "primaryColor": "#0f172a",
    "secondaryColor": "#334155",
    "accentColor": "#64748b",
    "backgroundColor": "#ffffff",
    "textColor": "#111827",
    "fontFamily": "Times New Roman, serif"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "backgroundColor": "#ffffff",
        "borderBottom": "4px solid #0f172a",
        "color": "#0f172a",
        "fontSize": "1.875rem",
        "fontWeight": "700",
        "letterSpacing": "3px",
        "padding": "40px 50px",
        "textAlign": "left",
        "textTransform": "uppercase",
        "titleFontSize": "1rem",
        "titleLetterSpacing": "1px",
        "titleFontWeight": "500"
      }
    },
    {
      "id": "summary",
      "type": "summary",
      "style": {
        "backgroundColor": "#f8fafc",
        "padding": "28px 50px",
        "lineHeight": "1.7",
        "fontSize": "0.9rem",
        "borderLeft": "4px solid #334155"
      }
    },
    {
      "id": "experience",
      "type": "experience",
      "style": {
        "padding": "28px 50px",
        "itemSpacing": "24px",
        "divider": "1px solid #e5e7eb"
      }
    },
    {
      "id": "bottom-grid",
      "type": "grid",
      "style": {
        "display": "grid",
        "gridTemplateColumns": "2fr 1fr",
        "gap": "40px",
        "padding": "28px 50px",
        "borderTop": "2px solid #0f172a"
      },
      "children": [
        {
          "id": "education",
          "type": "education"
        },
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "backgroundColor": "#f8fafc",
            "borderRadius": "8px",
            "padding": "24px",
            "display": "list"
          }
        }
      ]
    }
  ]
}'::jsonb,
description = 'Document-style formal resume with clear hierarchy, perfect for legal, government, and traditional industries'
WHERE name = 'Formal Document';

-- Update Minimalist Classic template
UPDATE resume_templates 
SET json_content = '{
  "theme": {
    "primaryColor": "#0f172a",
    "secondaryColor": "#475569",
    "accentColor": "#94a3b8",
    "backgroundColor": "#ffffff",
    "textColor": "#1e293b",
    "fontFamily": "Inter, sans-serif"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "backgroundColor": "#ffffff",
        "borderBottom": "1px solid #e2e8f0",
        "color": "#0f172a",
        "fontSize": "2.25rem",
        "fontWeight": "600",
        "letterSpacing": "0.5px",
        "padding": "48px 56px 36px",
        "textAlign": "center",
        "titleFontSize": "1rem",
        "titleFontWeight": "400",
        "titleOpacity": "0.7"
      }
    },
    {
      "id": "summary",
      "type": "summary",
      "style": {
        "padding": "36px 56px",
        "lineHeight": "1.8",
        "fontSize": "0.9rem",
        "textAlign": "center",
        "fontStyle": "normal",
        "color": "#475569"
      }
    },
    {
      "id": "experience",
      "type": "experience",
      "style": {
        "borderTop": "1px solid #f1f5f9",
        "padding": "36px 56px",
        "itemSpacing": "28px"
      }
    },
    {
      "id": "bottom-grid",
      "type": "grid",
      "style": {
        "display": "grid",
        "gridTemplateColumns": "1fr 1fr",
        "gap": "56px",
        "padding": "36px 56px",
        "borderTop": "1px solid #f1f5f9"
      },
      "children": [
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "display": "inline",
            "separator": " · "
          }
        },
        {
          "id": "education",
          "type": "education"
        }
      ]
    }
  ]
}'::jsonb,
description = 'Ultra-clean minimalist design with maximum white space, ideal for creative and design professionals'
WHERE name = 'Minimalist Classic';

-- Update Professional Blue template
UPDATE resume_templates 
SET json_content = '{
  "theme": {
    "primaryColor": "#1e3a8a",
    "secondaryColor": "#3b82f6",
    "accentColor": "#60a5fa",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Arial, sans-serif"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "backgroundColor": "#1e3a8a",
        "color": "#ffffff",
        "fontSize": "2.25rem",
        "fontWeight": "700",
        "padding": "44px 48px",
        "textAlign": "left",
        "titleFontSize": "1.125rem",
        "titleOpacity": "0.9",
        "titleFontWeight": "400"
      }
    },
    {
      "id": "summary",
      "type": "summary",
      "style": {
        "backgroundColor": "#eff6ff",
        "padding": "28px 48px",
        "lineHeight": "1.7",
        "fontSize": "0.9rem",
        "borderBottom": "3px solid #3b82f6"
      }
    },
    {
      "id": "main-columns",
      "type": "columns",
      "style": {
        "display": "grid",
        "gridTemplateColumns": "280px 1fr",
        "gap": "0",
        "sidebarWidth": "280px",
        "columnGap": "0"
      },
      "children": [
        {
          "id": "sidebar",
          "type": "sidebar",
          "style": {
            "backgroundColor": "#f0f9ff",
            "padding": "32px 28px",
            "borderRight": "1px solid #dbeafe"
          },
          "children": [
            {
              "id": "skills",
              "type": "skills",
              "style": {
                "marginBottom": "32px",
                "display": "list",
                "listStyle": "none"
              }
            },
            {
              "id": "education",
              "type": "education"
            }
          ]
        },
        {
          "id": "experience",
          "type": "experience",
          "style": {
            "padding": "32px 40px",
            "itemSpacing": "24px",
            "divider": "1px solid #e5e7eb"
          }
        }
      ]
    }
  ]
}'::jsonb,
description = 'Professional two-column layout with navy blue header, perfect for corporate and business professionals'
WHERE name = 'Professional Blue';

-- Update Refined Elegance template
UPDATE resume_templates 
SET json_content = '{
  "theme": {
    "primaryColor": "#7f1d1d",
    "secondaryColor": "#991b1b",
    "accentColor": "#b91c1c",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Georgia, serif"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "backgroundColor": "#7f1d1d",
        "color": "#ffffff",
        "fontFamily": "Georgia, serif",
        "fontSize": "2.375rem",
        "fontWeight": "700",
        "padding": "48px 56px",
        "textAlign": "center",
        "titleFontSize": "1.125rem",
        "titleFontWeight": "400",
        "titleOpacity": "0.9",
        "letterSpacing": "1px"
      }
    },
    {
      "id": "summary",
      "type": "summary",
      "style": {
        "borderBottom": "2px solid #fecaca",
        "borderTop": "2px solid #fecaca",
        "fontStyle": "italic",
        "padding": "36px 60px",
        "textAlign": "center",
        "lineHeight": "1.75",
        "fontSize": "0.95rem",
        "backgroundColor": "#fef2f2"
      }
    },
    {
      "id": "experience",
      "type": "experience",
      "style": {
        "padding": "36px 56px",
        "itemSpacing": "28px",
        "divider": "1px solid #fee2e2"
      }
    },
    {
      "id": "bottom-grid",
      "type": "grid",
      "style": {
        "display": "grid",
        "gridTemplateColumns": "1fr 1fr",
        "gap": "48px",
        "backgroundColor": "#fef2f2",
        "padding": "36px 56px",
        "borderTop": "3px solid #7f1d1d"
      },
      "children": [
        {
          "id": "education",
          "type": "education"
        },
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "display": "list",
            "listStyle": "none"
          }
        }
      ]
    }
  ]
}'::jsonb,
description = 'Sophisticated design with burgundy accents and refined serif typography for executives and consultants'
WHERE name = 'Refined Elegance';

-- Update Timeless Professional template
UPDATE resume_templates 
SET json_content = '{
  "theme": {
    "primaryColor": "#1e293b",
    "secondaryColor": "#475569",
    "accentColor": "#64748b",
    "backgroundColor": "#ffffff",
    "textColor": "#0f172a",
    "fontFamily": "Georgia, serif"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "backgroundColor": "#ffffff",
        "borderBottom": "3px double #1e293b",
        "color": "#1e293b",
        "fontFamily": "Georgia, serif",
        "fontSize": "2.375rem",
        "letterSpacing": "3px",
        "padding": "48px 56px",
        "textAlign": "center",
        "titleFontSize": "1rem",
        "titleLetterSpacing": "4px",
        "titleTextTransform": "uppercase",
        "titleFontWeight": "400"
      }
    },
    {
      "id": "summary",
      "type": "summary",
      "style": {
        "backgroundColor": "#f8fafc",
        "borderLeft": "4px solid #1e293b",
        "margin": "32px 56px",
        "padding": "28px 40px",
        "lineHeight": "1.75",
        "fontSize": "0.9rem"
      }
    },
    {
      "id": "main-grid",
      "type": "grid",
      "style": {
        "display": "grid",
        "gridTemplateColumns": "1fr 2fr",
        "gap": "40px",
        "padding": "0 56px 32px"
      },
      "children": [
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "backgroundColor": "#f8fafc",
            "borderRadius": "8px",
            "padding": "24px",
            "display": "list",
            "listStyle": "none"
          }
        },
        {
          "id": "experience",
          "type": "experience",
          "style": {
            "padding": "0",
            "itemSpacing": "24px",
            "divider": "1px solid #e5e7eb"
          }
        }
      ]
    },
    {
      "id": "education",
      "type": "education",
      "style": {
        "padding": "32px 56px",
        "borderTop": "2px solid #1e293b",
        "backgroundColor": "#f8fafc"
      }
    }
  ]
}'::jsonb,
description = 'Classic serif design with elegant double borders, perfect for law, finance, and consulting professionals'
WHERE name = 'Timeless Professional';

-- Update Traditional Sidebar template
UPDATE resume_templates 
SET json_content = '{
  "theme": {
    "primaryColor": "#1e293b",
    "secondaryColor": "#334155",
    "accentColor": "#64748b",
    "backgroundColor": "#ffffff",
    "textColor": "#0f172a",
    "fontFamily": "Arial, sans-serif"
  },
  "sections": [
    {
      "id": "main-layout",
      "type": "columns",
      "style": {
        "display": "flex",
        "sidebarWidth": "35%",
        "columnGap": "0"
      },
      "children": [
        {
          "id": "sidebar",
          "type": "sidebar",
          "style": {
            "backgroundColor": "#1e293b",
            "color": "#ffffff",
            "padding": "40px 28px"
          },
          "children": [
            {
              "id": "sidebar-header",
              "type": "header",
              "style": {
                "backgroundColor": "transparent",
                "color": "#ffffff",
                "fontSize": "1.5rem",
                "fontWeight": "700",
                "padding": "0 0 28px 0",
                "textAlign": "left",
                "borderBottom": "2px solid #475569",
                "marginBottom": "24px",
                "titleFontSize": "0.875rem",
                "titleOpacity": "0.8"
              }
            },
            {
              "id": "contact",
              "type": "contact",
              "style": {
                "marginBottom": "28px",
                "color": "#e2e8f0",
                "fontSize": "0.8rem",
                "lineHeight": "1.6"
              }
            },
            {
              "id": "skills",
              "type": "skills",
              "style": {
                "marginBottom": "28px",
                "display": "list",
                "listStyle": "none",
                "color": "#e2e8f0"
              }
            },
            {
              "id": "education",
              "type": "education",
              "style": {
                "color": "#e2e8f0"
              }
            }
          ]
        },
        {
          "id": "main",
          "type": "main",
          "style": {
            "padding": "40px 36px",
            "backgroundColor": "#ffffff"
          },
          "children": [
            {
              "id": "summary",
              "type": "summary",
              "style": {
                "marginBottom": "28px",
                "paddingBottom": "28px",
                "borderBottom": "2px solid #e5e7eb",
                "lineHeight": "1.7",
                "fontSize": "0.9rem"
              }
            },
            {
              "id": "experience",
              "type": "experience",
              "style": {
                "itemSpacing": "24px",
                "divider": "1px solid #f1f5f9"
              }
            }
          ]
        }
      ]
    }
  ]
}'::jsonb,
description = 'Classic two-column layout with dark sidebar containing contact and skills, ideal for traditional industries'
WHERE name = 'Traditional Sidebar';
