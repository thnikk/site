(function() {
	var theme = localStorage.getItem('theme') || 'auto';
	if (theme === 'auto') {
		theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
	}
	document.documentElement.setAttribute('data-theme', theme);

	document.addEventListener('DOMContentLoaded', function() {
		var current = localStorage.getItem('theme') || 'auto';
		document.querySelectorAll('.theme-btn').forEach(function(btn) {
			if (btn.getAttribute('data-theme') === current) {
				btn.classList.add('active');
			}
			btn.addEventListener('click', function() {
				var t = btn.getAttribute('data-theme');
				localStorage.setItem('theme', t);
				if (t === 'auto') {
					t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
				}
				document.documentElement.setAttribute('data-theme', t);
				document.querySelectorAll('.theme-btn').forEach(function(b) {
					b.classList.toggle('active', b === btn);
				});
			});
		});
	});
})();
