-- Update all templates with beautiful Canva-themed designs

DELETE FROM public.resume_templates;

-- Template 1: Blue Modern Professional (like the uploaded PDF)
INSERT INTO public.resume_templates (name, description, category, is_premium, template, styles, json_content) VALUES 
('Blue Modern Professional', 'Elegant blue gradient header with sidebar layout - inspired by professional Canva designs', 'professional', true, '{}', '{}', '{
  "layout": "blue-sidebar",
  "theme": {
    "primaryColor": "#1E40AF",
    "secondaryColor": "#3B82F6",
    "accentColor": "#60A5FA",
    "backgroundColor": "#FFFFFF",
    "textColor": "#1E293B",
    "fontFamily": "Inter"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "60px 50px",
        "background": "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
        "textAlign": "left",
        "color": "#FFFFFF",
        "borderRadius": "0 0 40px 0",
        "boxShadow": "0 10px 40px rgba(30, 64, 175, 0.3)"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columnGap": "0px",
        "sidebarWidth": "35%"
      },
      "children": [
        {
          "id": "sidebar",
          "type": "sidebar",
          "style": {
            "padding": "40px 30px",
            "backgroundColor": "#F1F5F9",
            "minHeight": "800px"
          },
          "children": [
            {
              "id": "contact",
              "type": "contact",
              "style": {
                "padding": "0 0 35px 0",
                "fontSize": "14px",
                "lineHeight": "1.8"
              }
            },
            {
              "id": "skills",
              "type": "skills",
              "style": {
                "padding": "0 0 35px 0",
                "display": "list",
                "listStyle": "disc",
                "fontSize": "14px"
              }
            },
            {
              "id": "education",
              "type": "education",
              "style": {
                "padding": "0",
                "itemSpacing": "20px"
              }
            }
          ]
        },
        {
          "id": "main",
          "type": "main",
          "style": {
            "padding": "40px 50px"
          },
          "children": [
            {
              "id": "summary",
              "type": "summary",
              "style": {
                "padding": "0 0 35px 0",
                "fontSize": "15px",
                "lineHeight": "1.7"
              }
            },
            {
              "id": "experience",
              "type": "experience",
              "style": {
                "padding": "0",
                "itemSpacing": "30px"
              }
            }
          ]
        }
      ]
    }
  ]
}'),

-- Template 2: Purple Creative Gradient
('Purple Creative Gradient', 'Stunning purple gradient with modern grid layout and rounded sections', 'creative', true, '{}', '{}', '{
  "layout": "creative-grid",
  "theme": {
    "primaryColor": "#7C3AED",
    "secondaryColor": "#A855F7",
    "accentColor": "#C084FC",
    "backgroundColor": "#FFFFFF",
    "textColor": "#1E293B",
    "fontFamily": "Inter"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "80px 60px",
        "background": "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)",
        "textAlign": "center",
        "color": "#FFFFFF",
        "borderRadius": "0 0 50px 50px",
        "boxShadow": "0 20px 60px rgba(124, 58, 237, 0.4)"
      }
    },
    {
      "id": "layout",
      "type": "grid",
      "style": {
        "columns": 3,
        "gap": "30px",
        "padding": "50px 60px"
      },
      "children": [
        {
          "id": "summary",
          "type": "summary",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FAF5FF",
            "borderRadius": "20px",
            "gridColumn": "span 2",
            "border": "2px solid #E9D5FF",
            "boxShadow": "0 10px 30px rgba(124, 58, 237, 0.1)"
          }
        },
        {
          "id": "contact",
          "type": "contact",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "20px",
            "border": "1px solid #E5E7EB",
            "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.08)"
          }
        },
        {
          "id": "experience",
          "type": "experience",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "20px",
            "gridColumn": "span 2",
            "itemSpacing": "25px",
            "border": "1px solid #E5E7EB",
            "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.08)"
          }
        },
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FAF5FF",
            "borderRadius": "20px",
            "display": "tags",
            "columns": 1,
            "border": "2px solid #E9D5FF"
          }
        },
        {
          "id": "education",
          "type": "education",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "20px",
            "gridColumn": "span 3",
            "itemSpacing": "20px",
            "border": "1px solid #E5E7EB",
            "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.08)"
          }
        }
      ]
    }
  ]
}'),

-- Template 3: Minimalist Clean White
('Minimalist Clean', 'Ultra-clean design with subtle borders and perfect spacing', 'modern', false, '{}', '{}', '{
  "layout": "minimalist",
  "theme": {
    "primaryColor": "#0F172A",
    "secondaryColor": "#475569",
    "accentColor": "#64748B",
    "backgroundColor": "#FFFFFF",
    "textColor": "#0F172A",
    "fontFamily": "Inter"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "70px 60px",
        "textAlign": "center",
        "backgroundColor": "#FFFFFF",
        "borderBottom": "3px solid #E2E8F0"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columnGap": "60px",
        "sidebarWidth": "32%"
      },
      "children": [
        {
          "id": "sidebar",
          "type": "sidebar",
          "style": {
            "padding": "50px 30px"
          },
          "children": [
            {
              "id": "contact",
              "type": "contact",
              "style": {
                "padding": "0 0 40px 0",
                "fontSize": "14px",
                "lineHeight": "2.0"
              }
            },
            {
              "id": "education",
              "type": "education",
              "style": {
                "padding": "0 0 40px 0",
                "itemSpacing": "25px"
              }
            },
            {
              "id": "skills",
              "type": "skills",
              "style": {
                "padding": "0",
                "display": "list",
                "listStyle": "disc"
              }
            }
          ]
        },
        {
          "id": "main",
          "type": "main",
          "style": {
            "padding": "50px 30px"
          },
          "children": [
            {
              "id": "summary",
              "type": "summary",
              "style": {
                "padding": "0 0 40px 0",
                "fontSize": "15px",
                "lineHeight": "1.7"
              }
            },
            {
              "id": "experience",
              "type": "experience",
              "style": {
                "padding": "0",
                "itemSpacing": "35px"
              }
            }
          ]
        }
      ]
    }
  ]
}'),

-- Template 4: Teal Tech Modern
('Teal Tech Modern', 'Fresh teal gradient with geometric sections and modern spacing', 'technology', false, '{}', '{}', '{
  "layout": "tech-grid",
  "theme": {
    "primaryColor": "#0F766E",
    "secondaryColor": "#14B8A6",
    "accentColor": "#2DD4BF",
    "backgroundColor": "#FFFFFF",
    "textColor": "#0F172A",
    "fontFamily": "Inter"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "70px 60px",
        "background": "linear-gradient(120deg, #0F766E 0%, #14B8A6 100%)",
        "textAlign": "left",
        "color": "#FFFFFF",
        "boxShadow": "0 15px 50px rgba(15, 118, 110, 0.3)"
      }
    },
    {
      "id": "layout",
      "type": "grid",
      "style": {
        "columns": 4,
        "gap": "25px",
        "padding": "50px 60px"
      },
      "children": [
        {
          "id": "summary",
          "type": "summary",
          "style": {
            "padding": "30px",
            "backgroundColor": "#F0FDFA",
            "borderRadius": "16px",
            "gridColumn": "span 3",
            "border": "2px solid #CCFBF1"
          }
        },
        {
          "id": "contact",
          "type": "contact",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "16px",
            "border": "1px solid #E5E7EB",
            "boxShadow": "0 10px 25px rgba(0, 0, 0, 0.06)"
          }
        },
        {
          "id": "experience",
          "type": "experience",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "16px",
            "gridColumn": "span 2",
            "itemSpacing": "25px",
            "border": "1px solid #E5E7EB",
            "boxShadow": "0 10px 25px rgba(0, 0, 0, 0.06)"
          }
        },
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "padding": "30px",
            "backgroundColor": "#F0FDFA",
            "borderRadius": "16px",
            "display": "tags",
            "columns": 1,
            "border": "2px solid #CCFBF1"
          }
        },
        {
          "id": "education",
          "type": "education",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "16px",
            "gridColumn": "span 1",
            "itemSpacing": "20px",
            "border": "1px solid #E5E7EB",
            "boxShadow": "0 10px 25px rgba(0, 0, 0, 0.06)"
          }
        }
      ]
    }
  ]
}'),

-- Template 5: Elegant Rose Gold
('Elegant Rose Gold', 'Sophisticated rose gold accents with elegant serif typography', 'professional', true, '{}', '{}', '{
  "layout": "elegant",
  "theme": {
    "primaryColor": "#BE185D",
    "secondaryColor": "#DB2777",
    "accentColor": "#EC4899",
    "backgroundColor": "#FFFFFF",
    "textColor": "#1C1917",
    "fontFamily": "Playfair Display"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "80px 70px",
        "textAlign": "center",
        "background": "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)",
        "borderBottom": "4px solid #EC4899"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columnGap": "50px",
        "sidebarWidth": "36%"
      },
      "children": [
        {
          "id": "sidebar",
          "type": "sidebar",
          "style": {
            "padding": "50px 40px"
          },
          "children": [
            {
              "id": "summary",
              "type": "summary",
              "style": {
                "padding": "0 0 40px 0",
                "fontSize": "15px",
                "lineHeight": "1.8",
                "fontStyle": "italic"
              }
            },
            {
              "id": "contact",
              "type": "contact",
              "style": {
                "padding": "0 0 40px 0",
                "fontSize": "14px"
              }
            },
            {
              "id": "skills",
              "type": "skills",
              "style": {
                "padding": "0 0 40px 0",
                "display": "list",
                "listStyle": "disc"
              }
            },
            {
              "id": "education",
              "type": "education",
              "style": {
                "padding": "0",
                "itemSpacing": "25px"
              }
            }
          ]
        },
        {
          "id": "main",
          "type": "main",
          "style": {
            "padding": "50px 40px"
          },
          "children": [
            {
              "id": "experience",
              "type": "experience",
              "style": {
                "padding": "0",
                "itemSpacing": "40px",
                "divider": "1px solid #FCE7F3"
              }
            }
          ]
        }
      ]
    }
  ]
}'),

-- Template 6: Bold Orange Creative
('Bold Orange Creative', 'Vibrant orange design with dynamic card-based layout', 'creative', true, '{}', '{}', '{
  "layout": "creative-cards",
  "theme": {
    "primaryColor": "#EA580C",
    "secondaryColor": "#F97316",
    "accentColor": "#FB923C",
    "backgroundColor": "#FFFFFF",
    "textColor": "#1E293B",
    "fontFamily": "Inter"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "70px 60px",
        "background": "linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FB923C 100%)",
        "textAlign": "left",
        "color": "#FFFFFF",
        "borderRadius": "0 0 35px 35px",
        "boxShadow": "0 20px 60px rgba(234, 88, 12, 0.35)"
      }
    },
    {
      "id": "layout",
      "type": "grid",
      "style": {
        "columns": 6,
        "gap": "25px",
        "padding": "45px 60px"
      },
      "children": [
        {
          "id": "summary",
          "type": "summary",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFF7ED",
            "borderRadius": "20px",
            "gridColumn": "span 4",
            "border": "2px solid #FED7AA",
            "boxShadow": "0 8px 25px rgba(234, 88, 12, 0.08)"
          }
        },
        {
          "id": "contact",
          "type": "contact",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "20px",
            "gridColumn": "span 2",
            "border": "1px solid #E5E7EB",
            "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.08)"
          }
        },
        {
          "id": "experience",
          "type": "experience",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "20px",
            "gridColumn": "span 4",
            "itemSpacing": "28px",
            "border": "1px solid #E5E7EB",
            "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.08)"
          }
        },
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFF7ED",
            "borderRadius": "20px",
            "gridColumn": "span 2",
            "display": "tags",
            "columns": 1,
            "border": "2px solid #FED7AA"
          }
        },
        {
          "id": "education",
          "type": "education",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "20px",
            "gridColumn": "span 6",
            "itemSpacing": "22px",
            "border": "1px solid #E5E7EB",
            "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.08)"
          }
        }
      ]
    }
  ]
}'),

-- Template 7: Navy Corporate Elite
('Navy Corporate Elite', 'Premium navy design with luxury feel and bordered sidebar', 'corporate', true, '{}', '{}', '{
  "layout": "corporate-elite",
  "theme": {
    "primaryColor": "#1E3A8A",
    "secondaryColor": "#2563EB",
    "accentColor": "#3B82F6",
    "backgroundColor": "#FFFFFF",
    "textColor": "#0F172A",
    "fontFamily": "Playfair Display"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "75px 70px",
        "background": "linear-gradient(120deg, #1E3A8A 0%, #2563EB 100%)",
        "textAlign": "left",
        "color": "#FFFFFF",
        "boxShadow": "0 20px 60px rgba(30, 58, 138, 0.4)"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columnGap": "0px",
        "sidebarWidth": "38%"
      },
      "children": [
        {
          "id": "sidebar",
          "type": "sidebar",
          "style": {
            "padding": "50px 40px",
            "backgroundColor": "#F8FAFC",
            "minHeight": "850px",
            "borderRight": "4px solid #2563EB"
          },
          "children": [
            {
              "id": "contact",
              "type": "contact",
              "style": {
                "padding": "0 0 40px 0",
                "fontSize": "15px",
                "lineHeight": "1.8"
              }
            },
            {
              "id": "skills",
              "type": "skills",
              "style": {
                "padding": "0 0 40px 0",
                "display": "list",
                "listStyle": "disc"
              }
            },
            {
              "id": "education",
              "type": "education",
              "style": {
                "padding": "0",
                "itemSpacing": "25px",
                "tableLayout": true
              }
            }
          ]
        },
        {
          "id": "main",
          "type": "main",
          "style": {
            "padding": "50px 55px"
          },
          "children": [
            {
              "id": "summary",
              "type": "summary",
              "style": {
                "padding": "25px",
                "fontSize": "16px",
                "lineHeight": "1.8",
                "backgroundColor": "#EFF6FF",
                "borderRadius": "15px",
                "border": "1px solid #DBEAFE",
                "marginBottom": "40px"
              }
            },
            {
              "id": "experience",
              "type": "experience",
              "style": {
                "padding": "0",
                "itemSpacing": "38px"
              }
            }
          ]
        }
      ]
    }
  ]
}'),

-- Template 8: Indigo Executive
('Indigo Executive Prestige', 'Distinguished indigo gradient with luxury card elements', 'executive', true, '{}', '{}', '{
  "layout": "executive-luxury",
  "theme": {
    "primaryColor": "#4C1D95",
    "secondaryColor": "#6D28D9",
    "accentColor": "#8B5CF6",
    "backgroundColor": "#FFFFFF",
    "textColor": "#1E1B4B",
    "fontFamily": "Playfair Display"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "90px 70px",
        "background": "linear-gradient(135deg, #4C1D95 0%, #6D28D9 50%, #8B5CF6 100%)",
        "textAlign": "center",
        "color": "#FFFFFF",
        "boxShadow": "0 25px 80px rgba(76, 29, 149, 0.45)"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columnGap": "0px",
        "sidebarWidth": "37%"
      },
      "children": [
        {
          "id": "sidebar",
          "type": "sidebar",
          "style": {
            "padding": "55px 45px",
            "backgroundColor": "#FAF5FF",
            "minHeight": "900px",
            "borderRight": "2px solid #E9D5FF"
          },
          "children": [
            {
              "id": "contact",
              "type": "contact",
              "style": {
                "padding": "0 0 45px 0",
                "fontSize": "15px",
                "lineHeight": "2.0"
              }
            },
            {
              "id": "summary",
              "type": "summary",
              "style": {
                "padding": "30px",
                "fontSize": "15px",
                "lineHeight": "1.8",
                "backgroundColor": "#FFFFFF",
                "borderRadius": "18px",
                "boxShadow": "0 10px 35px rgba(76, 29, 149, 0.12)",
                "border": "2px solid #E9D5FF",
                "marginBottom": "40px"
              }
            },
            {
              "id": "skills",
              "type": "skills",
              "style": {
                "padding": "30px",
                "backgroundColor": "#FFFFFF",
                "borderRadius": "18px",
                "display": "list",
                "listStyle": "disc",
                "boxShadow": "0 10px 35px rgba(76, 29, 149, 0.12)",
                "border": "2px solid #E9D5FF"
              }
            }
          ]
        },
        {
          "id": "main",
          "type": "main",
          "style": {
            "padding": "55px 70px"
          },
          "children": [
            {
              "id": "experience",
              "type": "experience",
              "style": {
                "padding": "0 0 45px 0",
                "itemSpacing": "42px"
              }
            },
            {
              "id": "education",
              "type": "education",
              "style": {
                "padding": "0",
                "itemSpacing": "28px"
              }
            }
          ]
        }
      ]
    }
  ]
}'),

-- Template 9: Emerald Business Professional
('Emerald Business Pro', 'Fresh emerald green with clean professional layout', 'business', false, '{}', '{}', '{
  "layout": "business-clean",
  "theme": {
    "primaryColor": "#047857",
    "secondaryColor": "#059669",
    "accentColor": "#10B981",
    "backgroundColor": "#FFFFFF",
    "textColor": "#111827",
    "fontFamily": "Inter"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "65px 60px",
        "textAlign": "left",
        "background": "linear-gradient(135deg, #047857 0%, #059669 100%)",
        "color": "#FFFFFF",
        "boxShadow": "0 15px 50px rgba(4, 120, 87, 0.3)"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columnGap": "50px",
        "sidebarWidth": "35%"
      },
      "children": [
        {
          "id": "sidebar",
          "type": "sidebar",
          "style": {
            "padding": "45px 35px"
          },
          "children": [
            {
              "id": "contact",
              "type": "contact",
              "style": {
                "padding": "0 0 35px 0",
                "fontSize": "14px",
                "lineHeight": "1.8"
              }
            },
            {
              "id": "education",
              "type": "education",
              "style": {
                "padding": "0 0 35px 0",
                "itemSpacing": "22px"
              }
            },
            {
              "id": "skills",
              "type": "skills",
              "style": {
                "padding": "0",
                "display": "list",
                "listStyle": "disc"
              }
            }
          ]
        },
        {
          "id": "main",
          "type": "main",
          "style": {
            "padding": "45px 35px"
          },
          "children": [
            {
              "id": "summary",
              "type": "summary",
              "style": {
                "padding": "0 0 38px 0",
                "fontSize": "15px",
                "lineHeight": "1.7",
                "borderLeft": "4px solid #059669",
                "paddingLeft": "20px"
              }
            },
            {
              "id": "experience",
              "type": "experience",
              "style": {
                "padding": "0",
                "itemSpacing": "32px"
              }
            }
          ]
        }
      ]
    }
  ]
}'),

-- Template 10: Red Bold Impact
('Red Bold Impact', 'Eye-catching red gradient with modern asymmetric layout', 'creative', true, '{}', '{}', '{
  "layout": "bold-impact",
  "theme": {
    "primaryColor": "#DC2626",
    "secondaryColor": "#EF4444",
    "accentColor": "#F87171",
    "backgroundColor": "#FFFFFF",
    "textColor": "#1F2937",
    "fontFamily": "Inter"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "75px 60px",
        "background": "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
        "textAlign": "left",
        "color": "#FFFFFF",
        "borderRadius": "0 0 45px 45px",
        "boxShadow": "0 22px 65px rgba(220, 38, 38, 0.38)"
      }
    },
    {
      "id": "layout",
      "type": "grid",
      "style": {
        "columns": 5,
        "gap": "28px",
        "padding": "50px 60px"
      },
      "children": [
        {
          "id": "summary",
          "type": "summary",
          "style": {
            "padding": "32px",
            "backgroundColor": "#FEF2F2",
            "borderRadius": "22px",
            "gridColumn": "span 3",
            "border": "2px solid #FECACA",
            "boxShadow": "0 12px 35px rgba(220, 38, 38, 0.1)"
          }
        },
        {
          "id": "contact",
          "type": "contact",
          "style": {
            "padding": "32px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "22px",
            "gridColumn": "span 2",
            "border": "1px solid #E5E7EB",
            "boxShadow": "0 12px 35px rgba(0, 0, 0, 0.1)"
          }
        },
        {
          "id": "experience",
          "type": "experience",
          "style": {
            "padding": "32px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "22px",
            "gridColumn": "span 3",
            "itemSpacing": "30px",
            "border": "1px solid #E5E7EB",
            "boxShadow": "0 12px 35px rgba(0, 0, 0, 0.1)"
          }
        },
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "padding": "32px",
            "backgroundColor": "#FEF2F2",
            "borderRadius": "22px",
            "gridColumn": "span 2",
            "display": "tags",
            "columns": 1,
            "border": "2px solid #FECACA"
          }
        },
        {
          "id": "education",
          "type": "education",
          "style": {
            "padding": "32px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "22px",
            "gridColumn": "span 5",
            "itemSpacing": "24px",
            "border": "1px solid #E5E7EB",
            "boxShadow": "0 12px 35px rgba(0, 0, 0, 0.1)"
          }
        }
      ]
    }
  ]
}');