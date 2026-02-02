#!/bin/bash

# vONE Desktop Application Installer
# opendev-labs

echo "Installing vONE Desktop Application..."

# Make AppImage executable
chmod +x "/home/cube/Live Projects/void/release/vONE-1.0.0.AppImage"

# Copy to Desktop for easy access
cp "/home/cube/Live Projects/void/release/vONE-1.0.0.AppImage" ~/Desktop/vONE.AppImage
chmod +x ~/Desktop/vONE.AppImage

# Create .desktop file for applications menu
mkdir -p ~/.local/share/applications

cat > ~/.local/share/applications/void.desktop << 'EOF'
[Desktop Entry]
Name=vONE
Comment=Hyper-Intelligent Virtual Environment Manager - opendev-labs
Exec=/home/cube/Desktop/vONE.AppImage
Icon=/home/cube/Live Projects/void/build/icon.png
Terminal=false
Type=Application
Categories=Development;
StartupWMClass=vONE
EOF

chmod +x ~/.local/share/applications/void.desktop

# Update desktop database
update-desktop-database ~/.local/share/applications 2>/dev/null || true

echo ""
echo "✅ vONE Desktop Application installed successfully!"
echo ""
echo "You can now:"
echo "  1. Launch from Applications menu (search for 'vONE')"
echo "  2. Double-click vONE.AppImage on your Desktop"
echo "  3. Run: ~/Desktop/vONE.AppImage"
echo ""
echo "🌐 Wildcard URL Support:"
echo "  - Local server runs on port 3456"
echo "  - Add to /etc/hosts: 127.0.0.1 *.vone.app"
echo "  - Projects will be accessible at username.vone.app"
echo ""
