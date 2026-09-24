(function() {
	var saved = localStorage.getItem('theme') || 'auto';
	var theme = saved === 'auto'
		? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
		: saved;
	document.documentElement.setAttribute('data-theme', theme);

	matchMedia('(prefers-color-scheme: light)').addEventListener('change', function() {
		if (localStorage.getItem('theme') !== 'auto') return;
		var t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', t);
	});

	document.addEventListener('DOMContentLoaded', function() {
		// Footer build-date tooltip from the server's Last-Modified header
		var footerCopy = document.querySelector('.footer-inner > span');
		if (footerCopy) {
			var modified = new Date(document.lastModified);
			if (!isNaN(modified.getTime())) {
				var mm = String(modified.getMonth() + 1).padStart(2, '0');
				var dd = String(modified.getDate()).padStart(2, '0');
				footerCopy.title = 'Last updated ' + modified.getFullYear() + '-' + mm + '-' + dd;
			}
		}

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

		var navs = document.querySelectorAll('.nav-inner');

		function overflows(container) {
			var cs = getComputedStyle(container);
			var padRight = parseFloat(cs.paddingRight) || 0;
			var rightEdge = container.getBoundingClientRect().right - padRight;
			var last = container.lastElementChild;
			if (!last) return false;
			return last.getBoundingClientRect().right > rightEdge + 1;
		}

		function updateNav() {
			navs.forEach(function(nav) {
				var links = nav.querySelector('.nav-links');
				if (!links) return;

				links.classList.add('nav-measuring');
				var labelsOverflow = overflows(links);
				links.classList.remove('nav-measuring');

				links.classList.add('nav-measuring-icons');
				var iconsOverflow = overflows(links);
				links.classList.remove('nav-measuring-icons');

				nav.classList.toggle('nav-collapsed', labelsOverflow);
				nav.classList.toggle('nav-icons-collapsed', iconsOverflow);
				if (!iconsOverflow) {
					nav.classList.remove('nav-open');
					var hb = nav.querySelector('.hamburger');
					if (hb) hb.classList.remove('open');
				}
			});
		}

		updateNav();
		window.addEventListener('resize', updateNav);
		window.addEventListener('load', updateNav);

		navs.forEach(function(nav) {
			var hamburger = nav.querySelector('.hamburger');
			var navLinks = nav.querySelector('.nav-links');
			if (!hamburger || !navLinks) return;

			hamburger.addEventListener('click', function(e) {
				e.stopPropagation();
				hamburger.classList.toggle('open');
				nav.classList.toggle('nav-open');
			});

			navLinks.querySelectorAll('.nav-link').forEach(function(link) {
				link.addEventListener('click', function() {
					hamburger.classList.remove('open');
					nav.classList.remove('nav-open');
				});
			});

			document.addEventListener('click', function(e) {
				if (!nav.contains(e.target)) {
					hamburger.classList.remove('open');
					nav.classList.remove('nav-open');
				}
			});

			document.addEventListener('keydown', function(e) {
				if (e.key === 'Escape') {
					hamburger.classList.remove('open');
					nav.classList.remove('nav-open');
				}
			});
		});
	});
})();
