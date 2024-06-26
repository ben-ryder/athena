export function LoadingIcon() {
	return (
		<div className="fill-br-teal-600">
			<svg
				width="100"
				height="100"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect x="1" y="1" rx="1" width="10" height="10">
					<animate
						id="a"
						begin="0;k.end"
						attributeName="x"
						dur="0.2s"
						values="1;13"
						fill="freeze"
					/>
					<animate
						id="d"
						begin="b.end"
						attributeName="y"
						dur="0.2s"
						values="1;13"
						fill="freeze"
					/>
					<animate
						id="g"
						begin="e.end"
						attributeName="x"
						dur="0.2s"
						values="13;1"
						fill="freeze"
					/>
					<animate
						id="j"
						begin="h.end"
						attributeName="y"
						dur="0.2s"
						values="13;1"
						fill="freeze"
					/>
				</rect>
				<rect x="1" y="13" rx="1" width="10" height="10">
					<animate
						id="b"
						begin="a.end"
						attributeName="y"
						dur="0.2s"
						values="13;1"
						fill="freeze"
					/>
					<animate
						id="e"
						begin="d.end"
						attributeName="x"
						dur="0.2s"
						values="1;13"
						fill="freeze"
					/>
					<animate
						id="h"
						begin="g.end"
						attributeName="y"
						dur="0.2s"
						values="1;13"
						fill="freeze"
					/>
					<animate
						id="k"
						begin="j.end"
						attributeName="x"
						dur="0.2s"
						values="13;1"
						fill="freeze"
					/>
				</rect>
			</svg>
		</div>
	);
}

export function LoadingIconCube() {
	return (
		<svg width="100" height="100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" rx="1" width="10" height="10"><animate id="a" begin="0;k.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze"/><animate id="d" begin="b.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze"/><animate id="g" begin="e.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze"/><animate id="j" begin="h.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze"/></rect><rect x="1" y="13" rx="1" width="10" height="10"><animate id="b" begin="a.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze"/><animate id="e" begin="d.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze"/><animate id="h" begin="g.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze"/><animate id="k" begin="j.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze"/></rect></svg>
	)
}