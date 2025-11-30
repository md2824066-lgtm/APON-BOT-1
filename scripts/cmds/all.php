<?php
// Directory listing script with navigation
$base_dir = realpath(dirname(__FILE__));
$requested_path = isset($_GET['path']) ? $_GET['path'] : '';

// Security: Prevent directory traversal
if ($requested_path) {
 $requested_path = str_replace('..', '', $requested_path); // Remove parent directory references
 $current_path = realpath($base_dir . DIRECTORY_SEPARATOR . $requested_path);
 
 // Ensure the requested path is within base directory
 if (!$current_path || strpos($current_path, $base_dir) !== 0) {
 $current_path = $base_dir;
 $requested_path = '';
 }
} else {
 $current_path = $base_dir;
}

$items = scandir($current_path);
$relative_path = str_replace($base_dir, '', $current_path);
$relative_path = $relative_path ? ltrim($relative_path, DIRECTORY_SEPARATOR) : 'Current Folder';

// Check if we're in a subdirectory to show back button
$is_subdirectory = ($current_path !== $base_dir);
$parent_path = dirname($requested_path);
?>
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
 <title>Directory Listing</title>
 <style>
 * {
 margin: 0;
 padding: 0;
 box-sizing: border-box;
 -webkit-tap-highlight-color: transparent;
 }
 
 body {
 font-family: 'Roboto', Arial, sans-serif;
 background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
 min-height: 100vh;
 padding: 20px;
 overflow-x: hidden;
 }
 
 .container {
 max-width: 100%;
 background: rgba(255, 255, 255, 0.95);
 border-radius: 20px;
 box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
 backdrop-filter: blur(10px);
 overflow: hidden;
 margin: 0 auto;
 }
 
 .header {
 background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
 padding: 25px;
 text-align: center;
 border-bottom: 1px solid rgba(255, 255, 255, 0.2);
 }
 
 .header h1 {
 color: white;
 font-size: 1.4em;
 font-weight: 600;
 text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
 margin-bottom: 10px;
 }
 
 .path {
 color: rgba(255, 255, 255, 0.9);
 font-size: 0.9em;
 word-break: break-all;
 }
 
 .navigation {
 display: flex;
 gap: 10px;
 margin-top: 15px;
 justify-content: center;
 }
 
 .nav-btn {
 background: rgba(255, 255, 255, 0.2);
 border: 1px solid rgba(255, 255, 255, 0.3);
 color: white;
 padding: 8px 16px;
 border-radius: 20px;
 text-decoration: none;
 font-size: 0.8em;
 transition: all 0.3s ease;
 backdrop-filter: blur(10px);
 }
 
 .nav-btn:hover {
 background: rgba(255, 255, 255, 0.3);
 transform: translateY(-1px);
 }
 
 .file-list {
 padding: 20px;
 max-height: 65vh;
 overflow-y: auto;
 }
 
 .item {
 display: flex;
 align-items: center;
 padding: 15px 20px;
 margin-bottom: 12px;
 background: rgba(255, 255, 255, 0.7);
 border-radius: 15px;
 border: 1px solid rgba(255, 255, 255, 0.3);
 transition: all 0.3s ease;
 box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
 text-decoration: none;
 color: inherit;
 }
 
 .item:hover {
 transform: translateY(-2px);
 box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
 background: rgba(255, 255, 255, 0.9);
 }
 
 .icon {
 width: 24px;
 height: 24px;
 margin-right: 15px;
 filter: hue-rotate(180deg);
 }
 
 .folder .icon {
 background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234facfe"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>') no-repeat;
 }
 
 .file .icon {
 background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23767eea"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/></svg>') no-repeat;
 }
 
 .item-info {
 flex: 1;
 }
 
 .name {
 font-weight: 500;
 color: #333;
 font-size: 1em;
 margin-bottom: 4px;
 }
 
 .details {
 font-size: 0.8em;
 color: #666;
 }
 
 .size {
 font-weight: 500;
 color: #4facfe;
 }
 
 /* Scrollbar styling */
 ::-webkit-scrollbar {
 width: 6px;
 }
 
 ::-webkit-scrollbar-track {
 background: rgba(0, 0, 0, 0.1);
 border-radius: 10px;
 }
 
 ::-webkit-scrollbar-thumb {
 background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
 border-radius: 10px;
 }
 
 /* Android-specific optimizations */
 @media (max-width: 768px) {
 body {
 padding: 10px;
 }
 
 .header {
 padding: 20px;
 }
 
 .header h1 {
 font-size: 1.2em;
 }
 
 .file-list {
 padding: 15px;
 max-height: 60vh;
 }
 
 .item {
 padding: 12px 15px;
 margin-bottom: 10px;
 }
 
 .navigation {
 flex-direction: column;
 align-items: center;
 }
 
 .nav-btn {
 width: 80%;
 text-align: center;
 }
 }
 
 /* Prevent text selection */
 .item, .header, .nav-btn {
 -webkit-user-select: none;
 -moz-user-select: none;
 -ms-user-select: none;
 user-select: none;
 }
 
 .empty-folder {
 text-align: center;
 padding: 40px 20px;
 color: #666;
 font-style: italic;
 }
 </style>
</head>
<body>
 <div class="container">
 <div class="header">
 <h1>📁 Directory Browser</h1>
 <div class="path"><?php echo htmlspecialchars($current_path); ?></div>
 
 <div class="navigation">
 <?php if ($is_subdirectory): ?>
 <a href="?path=<?php echo urlencode($parent_path); ?>" class="nav-btn">
 ⬅️ Back to Parent
 </a>
 <?php endif; ?>
 
 <a href="?" class="nav-btn">
 🏠 Root Folder
 </a>
 </div>
 </div>
 
 <div class="file-list">
 <?php
 $has_items = false;
 
 foreach ($items as $item) {
 if ($item === '.' || $item === '..') continue;
 
 $full_path = $current_path . DIRECTORY_SEPARATOR . $item;
 $is_dir = is_dir($full_path);
 $file_size = $is_dir ? '' : format_filesize(filesize($full_path));
 $modified = date('Y-m-d H:i', filemtime($full_path));
 $icon_class = $is_dir ? 'folder' : 'file';
 
 if ($is_dir) {
 $item_path = $requested_path ? $requested_path . DIRECTORY_SEPARATOR . $item : $item;
 $item_url = '?path=' . urlencode($item_path);
 } else {
 $item_url = '#'; // Files are not clickable for navigation
 }
 
 echo "
 <a href='$item_url' class='item $icon_class'>
 <div class='icon'></div>
 <div class='item-info'>
 <div class='name'>" . htmlspecialchars($item) . "</div>
 <div class='details'>
 <span class='size'>$file_size</span>
 <span> • $modified</span>
 " . ($is_dir ? "<span> • 📁 Folder</span>" : "") . "
 </div>
 </div>
 </a>";
 $has_items = true;
 }
 
 if (!$has_items) {
 echo "<div class='empty-folder'>This folder is empty</div>";
 }
 
 function format_filesize($bytes) {
 if ($bytes >= 1073741824) {
 return number_format($bytes / 1073741824, 2) . ' GB';
 } elseif ($bytes >= 1048576) {
 return number_format($bytes / 1048576, 2) . ' MB';
 } elseif ($bytes >= 1024) {
 return number_format($bytes / 1024, 2) . ' KB';
 } else {
 return $bytes . ' bytes';
 }
 }
 ?>
 </div>
 </div>

 <script>
 // Add click handlers for files
 document.addEventListener('DOMContentLoaded', function() {
 const fileItems = document.querySelectorAll('.item.file');
 
 fileItems.forEach(item => {
 item.addEventListener('click', function(e) {
 e.preventDefault();
 const name = this.querySelector('.name').textContent;
 alert('File: ' + name + '\n\nFile preview/download functionality can be added here.');
 });
 });
 
 // Prevent zoom on double-tap
 let lastTouchEnd = 0;
 document.addEventListener('touchend', function(event) {
 const now = (new Date()).getTime();
 if (now - lastTouchEnd <= 300) {
 event.preventDefault();
 }
 lastTouchEnd = now;
 }, false);
 
 // Add loading feedback
 const links = document.querySelectorAll('a[href*="path"]');
 links.forEach(link => {
 link.addEventListener('click', function() {
 this.style.opacity = '0.7';
 });
 });
 });
 </script>
</body>
</noscript>
<div style="text-align: center;"><div style="position:relative; top:0; margin-right:auto;margin-left:auto; z-index:99999">

</div></div>
</html>