#!/bin/bash

# VOID Desktop Application Installer
# opendev-labs

echo "Installing VOID Desktop Application..."

# Make AppImage executable
chmod +x "/home/cube/Live Projects/void/release/VOID-1.0.0.AppImage"

# Copy to Desktop for easy access
cp "/home/cube/Live Projects/void/release/VOID-1.0.0.AppImage" ~/Desktop/VOID.AppImage
chmod +x ~/Desktop/VOID.AppImage

# Create .desktop file for applications menu
mkdir -p ~/.local/share/applications

cat > ~/.local/share/applications/void.desktop << 'EOF'
[Desktop Entry]
Name=VOID
Comment=Hyper-Intelligent Virtual Environment Manager - opendev-labs
Exec=/home/cube/Desktop/VOID.AppImage
Icon=/home/cube/Live Projects/void/build/icon.png
Terminal=false
Type=Application
Categories=Development;
StartupWMClass=VOID
EOF

chmod +x ~/.local/share/applications/void.desktop

# Update desktop database
update-desktop-database ~/.local/share/applications 2>/dev/null || true

echo ""
echo "✅ VOID Desktop Application installed successfully!"
echo ""
echo "You can now:"
echo "  1. Launch from Applications menu (search for 'VOID')"
echo "  2. Double-click VOID.AppImage on your Desktop"
echo "  3. Run: ~/Desktop/VOID.AppImage"
echo ""
echo "🌐 Wildcard URL Support:"
echo "  - Local server runs on port 3456"
echo "  - Add to /etc/hosts: 127.0.0.1 *.void.app"
echo "  - Projects will be accessible at username.void.app"
echo ""
