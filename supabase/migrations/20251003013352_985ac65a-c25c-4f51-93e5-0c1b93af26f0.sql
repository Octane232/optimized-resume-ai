-- Clear existing templates and insert new professional templates matching the uploaded PDFs

DELETE FROM public.resume_templates;

-- Template 1: Blue Professional Modern (based on Blue_Professional_Modern_CV_Resume.pdf)
INSERT INTO public.resume_templates (name, description, category, is_premium, template, styles, json_content) VALUES 
('Blue Professional Modern', 'Elegant blue-themed resume with left sidebar and geometric header design', 'professional', true, '{}', '{}', '{
  "layout": "blue-modern-sidebar",
  "theme": {
    "primaryColor": "#1E3A8A",
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
        "padding": "80px 60px",
        "background": "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
        "textAlign": "left",
        "color": "#FFFFFF",
        "position": "relative",
        "borderRadius": "0 0 50px 0"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columns": 2,
        "columnGap": "0px",
        "sidebarWidth": "35%"
      },
      "children": [
        {
          "id": "left",
          "type": "sidebar",
          "style": {
            "padding": "40px 30px",
            "backgroundColor": "#F8FAFC",
            "minHeight": "800px"
          },
          "children": [
            {
              "id": "contact",
              "type": "contact",
              "style": {
                "padding": "0 0 30px 0",
                "fontSize": "14px",
                "lineHeight": "1.8"
              }
            },
            {
              "id": "skills",
              "type": "skills",
              "style": {
                "padding": "30px 0",
                "display": "list",
                "listStyle": "disc",
                "fontSize": "14px"
              }
            }
          ]
        },
        {
          "id": "right",
          "type": "main",
          "style": {
            "padding": "40px 50px"
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
                "padding": "0 0 40px 0",
                "itemSpacing": "35px"
              }
            },
            {
              "id": "education",
              "type": "education",
              "style": {
                "padding": "0 0 30px 0",
                "itemSpacing": "20px"
              }
            }
          ]
        }
      ]
    }
  ]
}'),

('Modern Minimalist Professional', 'Clean design with elegant typography and strategic white space', 'modern', false, '{}', '{}', '{
  "layout": "minimalist-clean",
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
        "padding": "60px 80px",
        "textAlign": "center",
        "backgroundColor": "#FFFFFF",
        "borderBottom": "2px solid #E2E8F0"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columns": 2,
        "columnGap": "60px",
        "sidebarWidth": "30%"
      },
      "children": [
        {
          "id": "left",
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
          "id": "right",
          "type": "main",
          "style": {
            "padding": "50px 30px"
          },
          "children": [
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

('Executive Clean', 'Professional single-column layout with emphasis on experience', 'executive', false, '{}', '{}', '{
  "layout": "executive-single",
  "theme": {
    "primaryColor": "#374151",
    "secondaryColor": "#6B7280",
    "accentColor": "#9CA3AF",
    "backgroundColor": "#FFFFFF",
    "textColor": "#111827",
    "fontFamily": "Inter"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "60px 60px 40px 60px",
        "textAlign": "left",
        "backgroundColor": "#FFFFFF"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columns": 2,
        "columnGap": "50px",
        "sidebarWidth": "35%"
      },
      "children": [
        {
          "id": "left",
          "type": "sidebar",
          "style": {
            "padding": "0 30px 40px 60px"
          },
          "children": [
            {
              "id": "contact",
              "type": "contact",
              "style": {
                "padding": "0 0 30px 0",
                "fontSize": "14px"
              }
            },
            {
              "id": "education",
              "type": "education",
              "style": {
                "padding": "0 0 30px 0",
                "itemSpacing": "15px"
              }
            },
            {
              "id": "summary",
              "type": "summary",
              "style": {
                "padding": "0 0 30px 0",
                "fontSize": "14px",
                "lineHeight": "1.6"
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
          "id": "right",
          "type": "main",
          "style": {
            "padding": "0 60px 40px 30px"
          },
          "children": [
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

('White Modern Business', 'Sophisticated layout with elegant spacing and professional typography', 'business', true, '{}', '{}', '{
  "layout": "business-elegant",
  "theme": {
    "primaryColor": "#1F2937",
    "secondaryColor": "#4B5563",
    "accentColor": "#6B7280",
    "backgroundColor": "#FFFFFF",
    "textColor": "#111827",
    "fontFamily": "Inter"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "80px 60px",
        "textAlign": "left",
        "backgroundColor": "#FFFFFF",
        "borderBottom": "1px solid #E5E7EB"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columns": 2,
        "columnGap": "60px",
        "sidebarWidth": "38%"
      },
      "children": [
        {
          "id": "left",
          "type": "sidebar",
          "style": {
            "padding": "50px 40px 50px 60px"
          },
          "children": [
            {
              "id": "contact",
              "type": "contact",
              "style": {
                "padding": "0 0 40px 0",
                "fontSize": "14px",
                "lineHeight": "1.8"
              }
            },
            {
              "id": "education",
              "type": "education",
              "style": {
                "padding": "0 0 40px 0",
                "itemSpacing": "20px"
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
          "id": "right",
          "type": "main",
          "style": {
            "padding": "50px 60px 50px 40px"
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

('Creative Gradient Design', 'Modern gradient header with creative layout and vibrant colors', 'creative', true, '{}', '{}', '{
  "layout": "creative-gradient",
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
        "padding": "100px 60px",
        "background": "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)",
        "textAlign": "center",
        "color": "#FFFFFF",
        "borderRadius": "0 0 60px 60px",
        "boxShadow": "0 20px 60px rgba(124, 58, 237, 0.3)"
      }
    },
    {
      "id": "layout",
      "type": "grid",
      "style": {
        "columns": 3,
        "gap": "40px",
        "padding": "60px"
      },
      "children": [
        {
          "id": "summary",
          "type": "summary",
          "style": {
            "padding": "30px",
            "backgroundColor": "#F8FAFC",
            "borderRadius": "20px",
            "gridColumn": "span 2",
            "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.05)"
          }
        },
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "padding": "30px",
            "backgroundColor": "#F8FAFC",
            "borderRadius": "20px",
            "display": "tags",
            "columns": 1,
            "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.05)"
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
            "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.08)"
          }
        },
        {
          "id": "education",
          "type": "education",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "20px",
            "itemSpacing": "20px",
            "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.08)"
          }
        }
      ]
    }
  ]
}'),

('Corporate Elite', 'Premium corporate design with sophisticated color scheme', 'corporate', true, '{}', '{}', '{
  "layout": "corporate-premium",
  "theme": {
    "primaryColor": "#0C4A6E",
    "secondaryColor": "#0369A1",
    "accentColor": "#0284C7",
    "backgroundColor": "#FFFFFF",
    "textColor": "#0F172A",
    "fontFamily": "Playfair Display"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "80px 80px 60px 80px",
        "background": "linear-gradient(90deg, #0C4A6E 0%, #0369A1 100%)",
        "textAlign": "left",
        "color": "#FFFFFF",
        "position": "relative"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columns": 2,
        "columnGap": "0px",
        "sidebarWidth": "40%"
      },
      "children": [
        {
          "id": "left",
          "type": "sidebar",
          "style": {
            "padding": "50px 40px",
            "backgroundColor": "#F1F5F9",
            "minHeight": "800px",
            "borderRight": "4px solid #0369A1"
          },
          "children": [
            {
              "id": "contact",
              "type": "contact",
              "style": {
                "padding": "0 0 40px 0",
                "fontSize": "15px"
              }
            },
            {
              "id": "skills",
              "type": "skills",
              "style": {
                "padding": "0 0 40px 0",
                "display": "list"
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
          "id": "right",
          "type": "main",
          "style": {
            "padding": "50px 60px"
          },
          "children": [
            {
              "id": "summary",
              "type": "summary",
              "style": {
                "padding": "0 0 40px 0",
                "fontSize": "16px",
                "lineHeight": "1.8",
                "borderLeft": "4px solid #0369A1",
                "paddingLeft": "20px"
              }
            },
            {
              "id": "experience",
              "type": "experience",
              "style": {
                "padding": "0",
                "itemSpacing": "40px"
              }
            }
          ]
        }
      ]
    }
  ]
}'),

('Tech Innovation', 'Modern tech-focused design with clean geometric elements', 'technology', false, '{}', '{}', '{
  "layout": "tech-modern",
  "theme": {
    "primaryColor": "#059669",
    "secondaryColor": "#10B981",
    "accentColor": "#34D399",
    "backgroundColor": "#FFFFFF",
    "textColor": "#111827",
    "fontFamily": "Inter"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "70px 60px",
        "background": "linear-gradient(45deg, #059669 0%, #10B981 100%)",
        "textAlign": "left",
        "color": "#FFFFFF"
      }
    },
    {
      "id": "layout",
      "type": "grid",
      "style": {
        "columns": 4,
        "gap": "30px",
        "padding": "50px 60px"
      },
      "children": [
        {
          "id": "summary",
          "type": "summary",
          "style": {
            "padding": "25px",
            "backgroundColor": "#F0FDF4",
            "borderRadius": "15px",
            "gridColumn": "span 3",
            "border": "1px solid #BBF7D0"
          }
        },
        {
          "id": "contact",
          "type": "contact",
          "style": {
            "padding": "25px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "15px",
            "border": "1px solid #D1D5DB"
          }
        },
        {
          "id": "experience",
          "type": "experience",
          "style": {
            "padding": "25px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "15px",
            "gridColumn": "span 2",
            "itemSpacing": "25px",
            "border": "1px solid #D1D5DB"
          }
        },
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "padding": "25px",
            "backgroundColor": "#F0FDF4",
            "borderRadius": "15px",
            "display": "tags",
            "columns": 1,
            "border": "1px solid #BBF7D0"
          }
        },
        {
          "id": "education",
          "type": "education",
          "style": {
            "padding": "25px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "15px",
            "itemSpacing": "20px",
            "border": "1px solid #D1D5DB"
          }
        }
      ]
    }
  ]
}'),

('Elegant Professional', 'Sophisticated design with refined typography and balanced layout', 'professional', true, '{}', '{}', '{
  "layout": "elegant-refined",
  "theme": {
    "primaryColor": "#92400E",
    "secondaryColor": "#B45309",
    "accentColor": "#D97706",
    "backgroundColor": "#FFFFFF",
    "textColor": "#1C1917",
    "fontFamily": "Playfair Display"
  },
  "sections": [
    {
      "id": "header",
      "type": "header",
      "style": {
        "padding": "90px 70px",
        "textAlign": "center",
        "backgroundColor": "#FFFBEB",
        "borderBottom": "3px solid #D97706"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columns": 2,
        "columnGap": "60px",
        "sidebarWidth": "35%"
      },
      "children": [
        {
          "id": "left",
          "type": "sidebar",
          "style": {
            "padding": "60px 40px 60px 70px"
          },
          "children": [
            {
              "id": "summary",
              "type": "summary",
              "style": {
                "padding": "0 0 40px 0",
                "fontSize": "15px",
                "lineHeight": "1.7",
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
                "display": "list"
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
          "id": "right",
          "type": "main",
          "style": {
            "padding": "60px 70px 60px 40px"
          },
          "children": [
            {
              "id": "experience",
              "type": "experience",
              "style": {
                "padding": "0",
                "itemSpacing": "40px"
              }
            }
          ]
        }
      ]
    }
  ]
}'),

('Creative Portfolio', 'Artistic layout with dynamic sections and creative typography', 'creative', true, '{}', '{}', '{
  "layout": "creative-portfolio",
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
        "padding": "80px 60px 60px 60px",
        "background": "linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #F87171 100%)",
        "textAlign": "left",
        "color": "#FFFFFF",
        "borderRadius": "0 0 40px 40px"
      }
    },
    {
      "id": "layout",
      "type": "grid",
      "style": {
        "columns": 6,
        "gap": "25px",
        "padding": "50px 60px"
      },
      "children": [
        {
          "id": "summary",
          "type": "summary",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FEF2F2",
            "borderRadius": "25px",
            "gridColumn": "span 4",
            "border": "2px solid #FECACA"
          }
        },
        {
          "id": "contact",
          "type": "contact",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "25px",
            "gridColumn": "span 2",
            "boxShadow": "0 15px 40px rgba(0, 0, 0, 0.1)"
          }
        },
        {
          "id": "experience",
          "type": "experience",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "25px",
            "gridColumn": "span 4",
            "itemSpacing": "30px",
            "boxShadow": "0 15px 40px rgba(0, 0, 0, 0.1)"
          }
        },
        {
          "id": "skills",
          "type": "skills",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FEF2F2",
            "borderRadius": "25px",
            "gridColumn": "span 2",
            "display": "tags",
            "border": "2px solid #FECACA"
          }
        },
        {
          "id": "education",
          "type": "education",
          "style": {
            "padding": "30px",
            "backgroundColor": "#FFFFFF",
            "borderRadius": "25px",
            "gridColumn": "span 6",
            "itemSpacing": "25px",
            "boxShadow": "0 15px 40px rgba(0, 0, 0, 0.1)"
          }
        }
      ]
    }
  ]
}'),

('Executive Prestige', 'Premium executive template with distinguished styling and luxury feel', 'executive', true, '{}', '{}', '{
  "layout": "executive-prestige",
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
        "padding": "100px 80px 70px 80px",
        "background": "linear-gradient(135deg, #1E1B4B 0%, #4C1D95 50%, #6D28D9 100%)",
        "textAlign": "center",
        "color": "#FFFFFF",
        "position": "relative",
        "boxShadow": "0 25px 80px rgba(76, 29, 149, 0.4)"
      }
    },
    {
      "id": "layout",
      "type": "columns",
      "style": {
        "columns": 2,
        "columnGap": "0px",
        "sidebarWidth": "38%"
      },
      "children": [
        {
          "id": "left",
          "type": "sidebar",
          "style": {
            "padding": "60px 50px",
            "backgroundColor": "#FAF5FF",
            "minHeight": "900px",
            "borderRight": "1px solid #E9D5FF"
          },
          "children": [
            {
              "id": "contact",
              "type": "contact",
              "style": {
                "padding": "0 0 50px 0",
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
                "borderRadius": "20px",
                "boxShadow": "0 10px 30px rgba(76, 29, 149, 0.1)",
                "border": "1px solid #E9D5FF",
                "marginBottom": "40px"
              }
            },
            {
              "id": "skills",
              "type": "skills",
              "style": {
                "padding": "30px",
                "backgroundColor": "#FFFFFF",
                "borderRadius": "20px",
                "display": "list",
                "boxShadow": "0 10px 30px rgba(76, 29, 149, 0.1)",
                "border": "1px solid #E9D5FF"
              }
            }
          ]
        },
        {
          "id": "right",
          "type": "main",
          "style": {
            "padding": "60px 80px"
          },
          "children": [
            {
              "id": "experience",
              "type": "experience",
              "style": {
                "padding": "0 0 50px 0",
                "itemSpacing": "45px"
              }
            },
            {
              "id": "education",
              "type": "education",
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
}');