-- Upgrade the 10 modern templates to advanced, unique Canva-style layouts

-- 1) Azure Executive
UPDATE resume_templates SET json_content = jsonb_build_object(
  'layout','executive-modern',
  'theme', jsonb_build_object(
    'primaryColor','#2563EB','secondaryColor','#1E40AF','accentColor','#60A5FA',
    'backgroundColor','#FFFFFF','textColor','#0F172A','fontFamily','Inter'
  ),
  'sections', jsonb_build_array(
    jsonb_build_object('id','header','type','header','style', jsonb_build_object(
      'padding','88px 72px','background','linear-gradient(135deg,#1E40AF 0%,#2563EB 50%,#3B82F6 100%)','textAlign','left','color','#FFFFFF','boxShadow','0 24px 72px rgba(37,99,235,0.35)'
    )),
    jsonb_build_object('id','layout','type','columns','style', jsonb_build_object('columns',2,'columnGap','28px','sidebarWidth','32%'), 'children', jsonb_build_array(
      jsonb_build_object('id','left','type','sidebar','style', jsonb_build_object('padding','28px','backgroundColor','#F8FAFC','borderRight','1px solid #E2E8F0'), 'children', jsonb_build_array(
        jsonb_build_object('id','summary','type','summary','style', jsonb_build_object('padding','20px','fontSize','16px','lineHeight','1.8','borderLeft','6px solid #2563EB','backgroundColor','#FFFFFF','borderRadius','14px','boxShadow','0 4px 16px rgba(37,99,235,0.08)')),
        jsonb_build_object('id','skills','type','skills','style', jsonb_build_object('padding','20px','display','tags','columns',2,'gap','10px','backgroundColor','#FFFFFF','borderRadius','14px','boxShadow','0 4px 16px rgba(37,99,235,0.06)'))
      )),
      jsonb_build_object('id','right','type','main','style', jsonb_build_object('padding','28px 36px'), 'children', jsonb_build_array(
        jsonb_build_object('id','experience','type','experience','style', jsonb_build_object('padding','0','itemSpacing','28px','divider','1px solid #E2E8F0')),
        jsonb_build_object('id','education','type','education','style', jsonb_build_object('padding','12px 0','itemSpacing','18px'))
      ))
    ))
  )
) WHERE name='Azure Executive';

-- 2) Crimson Creative
UPDATE resume_templates SET json_content = jsonb_build_object(
  'layout','creative-asymmetric',
  'theme', jsonb_build_object('primaryColor','#DC2626','secondaryColor','#991B1B','accentColor','#FCA5A5','backgroundColor','#FFFBFB','textColor','#111827','fontFamily','Inter'),
  'sections', jsonb_build_array(
    jsonb_build_object('id','header','type','header','style', jsonb_build_object('padding','96px 96px 72px','background','linear-gradient(120deg,#991B1B 0%,#DC2626 100%)','textAlign','left','color','#FFFFFF','clipPath','polygon(0 0,100% 0,100% 82%,0 100%)','boxShadow','0 28px 80px rgba(220,38,38,0.4)')),
    jsonb_build_object('id','content','type','columns','style', jsonb_build_object('columns',2,'columnGap','32px','sidebarWidth','36%'), 'children', jsonb_build_array(
      jsonb_build_object('id','left','type','sidebar','style', jsonb_build_object('padding','28px','backgroundColor','#FEF2F2','borderRadius','22px'), 'children', jsonb_build_array(
        jsonb_build_object('id','summary','type','summary','style', jsonb_build_object('padding','20px','fontSize','16px','lineHeight','1.85','backgroundColor','#FFFFFF','borderRadius','16px','boxShadow','0 8px 24px rgba(220,38,38,0.12)')),
        jsonb_build_object('id','skills','type','skills','style', jsonb_build_object('padding','20px','display','blocks','columns',1,'gap','12px','backgroundColor','#FFFFFF','borderRadius','16px'))
      )),
      jsonb_build_object('id','right','type','main','style', jsonb_build_object('padding','8px 8px'), 'children', jsonb_build_array(
        jsonb_build_object('id','experience','type','experience','style', jsonb_build_object('padding','8px 0','itemSpacing','32px')),
        jsonb_build_object('id','education','type','education','style', jsonb_build_object('padding','8px 0','itemSpacing','20px'))
      ))
    ))
  )
) WHERE name='Crimson Creative';

-- 3) Violet Prestige
UPDATE resume_templates SET json_content = jsonb_build_object(
  'layout','prestige-cards',
  'theme', jsonb_build_object('primaryColor','#7C3AED','secondaryColor','#5B21B6','accentColor','#A78BFA','backgroundColor','#F9F5FF','textColor','#1F2937','fontFamily','Inter'),
  'sections', jsonb_build_array(
    jsonb_build_object('id','header','type','header','style', jsonb_build_object('padding','96px 72px','background','linear-gradient(135deg,#5B21B6 0%,#7C3AED 50%,#8B5CF6 100%)','textAlign','center','color','#FFFFFF','borderRadius','0 0 48px 48px','boxShadow','0 36px 96px rgba(124,58,237,0.35)')),
    jsonb_build_object('id','grid','type','grid','style', jsonb_build_object('columns',2,'gap','24px','padding','32px 72px'), 'children', jsonb_build_array(
      jsonb_build_object('id','summary','type','summary','style', jsonb_build_object('padding','24px','backgroundColor','#FFFFFF','borderRadius','24px','boxShadow','0 10px 32px rgba(124,58,237,0.15)')),
      jsonb_build_object('id','skills','type','skills','style', jsonb_build_object('padding','24px','display','tags','columns',3,'gap','12px','backgroundColor','#FFFFFF','borderRadius','24px','boxShadow','0 10px 32px rgba(124,58,237,0.12)'))
    )),
    jsonb_build_object('id','experience','type','experience','style', jsonb_build_object('padding','16px 72px 8px','itemSpacing','36px')),
    jsonb_build_object('id','education','type','education','style', jsonb_build_object('padding','0 72px 56px','itemSpacing','24px'))
  )
) WHERE name='Violet Prestige';

-- 4) Emerald Elite
UPDATE resume_templates SET json_content = jsonb_build_object(
  'layout','elite-split',
  'theme', jsonb_build_object('primaryColor','#059669','secondaryColor','#047857','accentColor','#34D399','backgroundColor','#FFFFFF','textColor','#0B2530','fontFamily','Inter'),
  'sections', jsonb_build_array(
    jsonb_build_object('id','header','type','header','style', jsonb_build_object('padding','84px 72px','background','linear-gradient(135deg,#047857 0%,#059669 50%,#10B981 100%)','textAlign','left','color','#FFFFFF','boxShadow','0 24px 70px rgba(5,150,105,0.35)')),
    jsonb_build_object('id','content','type','columns','style', jsonb_build_object('columns',2,'columnGap','28px','sidebarWidth','34%'), 'children', jsonb_build_array(
      jsonb_build_object('id','left','type','sidebar','style', jsonb_build_object('padding','28px','backgroundColor','#ECFDF5','borderRadius','18px'), 'children', jsonb_build_array(
        jsonb_build_object('id','skills','type','skills','style', jsonb_build_object('padding','18px','display','tags','columns',2,'gap','10px','backgroundColor','#FFFFFF','borderRadius','14px')),
        jsonb_build_object('id','education','type','education','style', jsonb_build_object('padding','18px','itemSpacing','14px','backgroundColor','#FFFFFF','borderRadius','14px'))
      )),
      jsonb_build_object('id','right','type','main','style', jsonb_build_object('padding','18px 28px'), 'children', jsonb_build_array(
        jsonb_build_object('id','summary','type','summary','style', jsonb_build_object('padding','18px','fontSize','16px','lineHeight','1.85','borderLeft','8px solid #059669','backgroundColor','#FFFFFF','borderRadius','14px')),
        jsonb_build_object('id','experience','type','experience','style', jsonb_build_object('padding','10px 0','itemSpacing','30px'))
      ))
    ))
  )
) WHERE name='Emerald Elite';

-- 5) Rose Elegance (serif aesthetic)
UPDATE resume_templates SET json_content = jsonb_build_object(
  'layout','elegant-serif',
  'theme', jsonb_build_object('primaryColor','#E11D48','secondaryColor','#BE123C','accentColor','#FB7185','backgroundColor','#FFF1F2','textColor','#4C0519','fontFamily','Playfair Display'),
  'sections', jsonb_build_array(
    jsonb_build_object('id','header','type','header','style', jsonb_build_object('padding','104px 96px','background','linear-gradient(135deg,#BE123C 0%,#E11D48 50%,#F43F5E 100%)','textAlign','center','color','#FFFFFF','borderBottom','6px solid #FFE4E6')),
    jsonb_build_object('id','summary','type','summary','style', jsonb_build_object('padding','28px 96px','fontSize','19px','lineHeight','2.0','fontStyle','italic','textAlign','center','borderTop','3px solid #E11D48','borderBottom','3px solid #E11D48','margin','40px 0')),
    jsonb_build_object('id','content','type','columns','style', jsonb_build_object('columns',2,'columnGap','32px','sidebarWidth','35%'), 'children', jsonb_build_array(
      jsonb_build_object('id','left','type','sidebar','style', jsonb_build_object('padding','24px','backgroundColor','#FFFFFF','borderRadius','18px','boxShadow','0 8px 24px rgba(225,29,72,0.08)'), 'children', jsonb_build_array(
        jsonb_build_object('id','skills','type','skills','style', jsonb_build_object('padding','20px','display','list','columns',1,'gap','8px'))
      )),
      jsonb_build_object('id','right','type','main','style', jsonb_build_object('padding','0 8px'), 'children', jsonb_build_array(
        jsonb_build_object('id','experience','type','experience','style', jsonb_build_object('padding','0','itemSpacing','32px')),
        jsonb_build_object('id','education','type','education','style', jsonb_build_object('padding','0','itemSpacing','20px'))
      ))
    ))
  )
) WHERE name='Rose Elegance';

-- 6) Ocean Professional
UPDATE resume_templates SET json_content = jsonb_build_object(
  'layout','professional-wave',
  'theme', jsonb_build_object('primaryColor','#0369A1','secondaryColor','#075985','accentColor','#38BDF8','backgroundColor','#FFFFFF','textColor','#0C4A6E','fontFamily','Inter'),
  'sections', jsonb_build_array(
    jsonb_build_object('id','header','type','header','style', jsonb_build_object('padding','92px 76px','background','linear-gradient(135deg,#075985 0%,#0369A1 50%,#0284C7 100%)','textAlign','center','color','#FFFFFF','borderRadius','0 0 60% 60% / 0 0 48px 48px','boxShadow','0 28px 80px rgba(3,105,161,0.35)')),
    jsonb_build_object('id','grid','type','grid','style', jsonb_build_object('columns',3,'gap','24px','padding','32px 76px'), 'children', jsonb_build_array(
      jsonb_build_object('id','summary','type','summary','style', jsonb_build_object('padding','20px','backgroundColor','#F0F9FF','borderRadius','16px')),
      jsonb_build_object('id','skills','type','skills','style', jsonb_build_object('padding','20px','display','tags','columns',2,'gap','10px','backgroundColor','#ECFEFF','borderRadius','16px')),
      jsonb_build_object('id','education','type','education','style', jsonb_build_object('padding','20px','itemSpacing','14px','backgroundColor','#EFF6FF','borderRadius','16px'))
    )),
    jsonb_build_object('id','experience','type','experience','style', jsonb_build_object('padding','12px 76px 56px','itemSpacing','32px'))
  )
) WHERE name='Ocean Professional';

-- 7) Teal Modern
UPDATE resume_templates SET json_content = jsonb_build_object(
  'layout','modern-layered',
  'theme', jsonb_build_object('primaryColor','#0D9488','secondaryColor','#0F766E','accentColor','#5EEAD4','backgroundColor','#F0FDFA','textColor','#134E4A','fontFamily','Inter'),
  'sections', jsonb_build_array(
    jsonb_build_object('id','header','type','header','style', jsonb_build_object('padding','84px 72px','background','linear-gradient(135deg,#0F766E 0%,#0D9488 100%)','textAlign','left','color','#FFFFFF','borderRadius','0 0 44px 0','boxShadow','0 24px 70px rgba(13,148,136,0.3)')),
    jsonb_build_object('id','content','type','columns','style', jsonb_build_object('columns',2,'columnGap','28px','sidebarWidth','30%'), 'children', jsonb_build_array(
      jsonb_build_object('id','left','type','sidebar','style', jsonb_build_object('padding','24px','backgroundColor','#FFFFFF','borderRadius','20px','boxShadow','0 10px 35px rgba(13,148,136,0.12)'), 'children', jsonb_build_array(
        jsonb_build_object('id','skills','type','skills','style', jsonb_build_object('padding','16px','display','tags','columns',2,'gap','8px'))
      )),
      jsonb_build_object('id','right','type','main','style', jsonb_build_object('padding','8px 12px'), 'children', jsonb_build_array(
        jsonb_build_object('id','summary','type','summary','style', jsonb_build_object('padding','16px','fontSize','16px','lineHeight','1.85','borderLeft','6px solid #0D9488','backgroundColor','#ECFDF5','borderRadius','12px')),
        jsonb_build_object('id','experience','type','experience','style', jsonb_build_object('padding','8px 0','itemSpacing','28px')),
        jsonb_build_object('id','education','type','education','style', jsonb_build_object('padding','8px 0','itemSpacing','18px'))
      ))
    ))
  )
) WHERE name='Teal Modern';

-- 8) Amber Prestige
UPDATE resume_templates SET json_content = jsonb_build_object(
  'layout','prestige-diagonal',
  'theme', jsonb_build_object('primaryColor','#D97706','secondaryColor','#B45309','accentColor','#FCD34D','backgroundColor','#FFFBEB','textColor','#78350F','fontFamily','Inter'),
  'sections', jsonb_build_array(
    jsonb_build_object('id','header','type','header','style', jsonb_build_object('padding','100px 84px','background','linear-gradient(135deg,#B45309 0%,#D97706 50%,#F59E0B 100%)','textAlign','left','color','#FFFFFF','clipPath','polygon(0 0,100% 0,100% 90%,0 100%)','boxShadow','0 32px 90px rgba(217,119,6,0.4)')),
    jsonb_build_object('id','grid','type','grid','style', jsonb_build_object('columns',2,'gap','28px','padding','36px 84px'), 'children', jsonb_build_array(
      jsonb_build_object('id','summary','type','summary','style', jsonb_build_object('padding','24px','backgroundColor','#FEF3C7','borderRadius','22px','boxShadow','0 10px 30px rgba(217,119,6,0.18)')),
      jsonb_build_object('id','skills','type','skills','style', jsonb_build_object('padding','24px','display','blocks','columns',2,'gap','12px','backgroundColor','#FFFBEB','borderRadius','22px'))
    )),
    jsonb_build_object('id','experience','type','experience','style', jsonb_build_object('padding','12px 84px 60px','itemSpacing','36px'))
  )
) WHERE name='Amber Prestige';

-- 9) Slate Professional
UPDATE resume_templates SET json_content = jsonb_build_object(
  'layout','professional-minimal',
  'theme', jsonb_build_object('primaryColor','#475569','secondaryColor','#334155','accentColor','#94A3B8','backgroundColor','#F8FAFC','textColor','#1E293B','fontFamily','Inter'),
  'sections', jsonb_build_array(
    jsonb_build_object('id','header','type','header','style', jsonb_build_object('padding','92px 76px','background','linear-gradient(135deg,#1E293B 0%,#334155 50%,#475569 100%)','textAlign','left','color','#FFFFFF','borderBottom','8px solid #CBD5E1')),
    jsonb_build_object('id','content','type','columns','style', jsonb_build_object('columns',2,'columnGap','28px','sidebarWidth','33%'), 'children', jsonb_build_array(
      jsonb_build_object('id','left','type','sidebar','style', jsonb_build_object('padding','24px','backgroundColor','#FFFFFF','borderRadius','16px','boxShadow','0 8px 28px rgba(15,23,42,0.08)'), 'children', jsonb_build_array(
        jsonb_build_object('id','skills','type','skills','style', jsonb_build_object('padding','16px','display','tags','columns',2,'gap','8px')),
        jsonb_build_object('id','education','type','education','style', jsonb_build_object('padding','16px','itemSpacing','12px'))
      )),
      jsonb_build_object('id','right','type','main','style', jsonb_build_object('padding','8px 16px'), 'children', jsonb_build_array(
        jsonb_build_object('id','summary','type','summary','style', jsonb_build_object('padding','16px','fontSize','16px','lineHeight','1.85','borderLeft','8px solid #475569','backgroundColor','#FFFFFF','borderRadius','12px')),
        jsonb_build_object('id','experience','type','experience','style', jsonb_build_object('padding','8px 0','itemSpacing','30px','divider','2px solid #E2E8F0'))
      ))
    ))
  )
) WHERE name='Slate Professional';

-- 10) Fuchsia Bold
UPDATE resume_templates SET json_content = jsonb_build_object(
  'layout','bold-dynamic',
  'theme', jsonb_build_object('primaryColor','#C026D3','secondaryColor','#A21CAF','accentColor','#E879F9','backgroundColor','#FDF4FF','textColor','#701A75','fontFamily','Inter'),
  'sections', jsonb_build_array(
    jsonb_build_object('id','header','type','header','style', jsonb_build_object('padding','108px 88px','background','linear-gradient(135deg,#A21CAF 0%,#C026D3 50%,#D946EF 100%)','textAlign','center','color','#FFFFFF','borderRadius','0 0 56px 56px','boxShadow','0 36px 96px rgba(192,38,211,0.4)')),
    jsonb_build_object('id','grid','type','grid','style', jsonb_build_object('columns',2,'gap','28px','padding','40px 88px'), 'children', jsonb_build_array(
      jsonb_build_object('id','summary','type','summary','style', jsonb_build_object('padding','24px','backgroundColor','#FFFFFF','borderRadius','24px','boxShadow','0 14px 44px rgba(192,38,211,0.18)')),
      jsonb_build_object('id','skills','type','skills','style', jsonb_build_object('padding','24px','display','tags','columns',3,'gap','12px','backgroundColor','#FFFFFF','borderRadius','24px','boxShadow','0 14px 44px rgba(192,38,211,0.16)'))
    )),
    jsonb_build_object('id','experience','type','experience','style', jsonb_build_object('padding','12px 88px','itemSpacing','36px')),
    jsonb_build_object('id','education','type','education','style', jsonb_build_object('padding','0 88px 72px','itemSpacing','24px'))
  )
) WHERE name='Fuchsia Bold';