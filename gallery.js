const CONTRACT = "0x19a9D64Fe37e02f7a07f3749fC1c58a6bcEa5E77";
const RPC = "https://rpc.sepolia.org";
const TOTAL = 51;

const WALL_POSITIONS = [
  { x: -12, y: 4,   z: -9.6, ry: 0   },
  { x:  -8, y: 4,   z: -9.6, ry: 0   },
  { x:  -4, y: 4,   z: -9.6, ry: 0   },
  { x:   0, y: 4,   z: -9.6, ry: 0   },
  { x:   4, y: 4,   z: -9.6, ry: 0   },
  { x:   8, y: 4,   z: -9.6, ry: 0   },
  { x:  12, y: 4,   z: -9.6, ry: 0   },
  { x: -12, y: 1.5, z: -9.6, ry: 0   },
  { x:  -8, y: 1.5, z: -9.6, ry: 0   },
  { x:  -4, y: 1.5, z: -9.6, ry: 0   },
  { x:   0, y: 1.5, z: -9.6, ry: 0   },
  { x:   4, y: 1.5, z: -9.6, ry: 0   },
  { x:   8, y: 1.5, z: -9.6, ry: 0   },
  { x:  12, y: 1.5, z: -9.6, ry: 0   },
  { x: -14, y: 4,   z: -3,   ry: 90  },
  { x: -14, y: 4,   z:  0,   ry: 90  },
  { x: -14, y: 4,   z:  3,   ry: 90  },
  { x:  14, y: 4,   z: -3,   ry: -90 },
  { x:  14, y: 4,   z:  0,   ry: -90 },
  { x:  14, y: 4,   z:  3,   ry: -90 },
];

function ipfsUrl(uri) {
  if (!uri) return "https://picsum.photos/seed/nft/400/400";
  const hash = uri.startsWith("ipfs://") ? uri.slice(7) : uri;
  return `https://ipfs.io/ipfs/${hash}`
  // fallback handled in placeNFT;
}

async function rpcCall(method, params) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params })
  });
  const data = await res.json();
  return data.result;
}

function encodeCall(selector, tokenId) {
  return selector + tokenId.toString(16).padStart(64, "0");
}

function decodeString(hex) {
  if (!hex || hex === "0x") return "";
  try {
    const clean = hex.slice(2);
    const length = parseInt(clean.slice(64, 128), 16) * 2;
    const str = clean.slice(128, 128 + length);
    return decodeURIComponent(str.replace(/../g, "%$&"));
  } catch { return ""; }
}

function decodeAddress(hex) {
  if (!hex || hex.length < 40) return "";
  return "0x" + hex.slice(-40);
}

function shortAddr(addr) {
  return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";
}

function makeText(value, position, color, width, wrapCount) {
  const el = document.createElement("a-entity");
  el.setAttribute("position", position);
  el.setAttribute("text", {
    value: value,
    align: "center",
    color: color,
    width: width,
    wrapCount: wrapCount || 24,
    font: "https://cdn.aframe.io/fonts/Roboto-msdf.json"
  });
  return el;
}

function placeNFT(scene, pos, metadata, tokenId, owner) {
  const group = document.createElement("a-entity");
  group.setAttribute("position", `${pos.x} ${pos.y} ${pos.z}`);
  group.setAttribute("rotation", `0 ${pos.ry || 0} 0`);

  const frame = document.createElement("a-plane");
  frame.setAttribute("width", "2.3");
  frame.setAttribute("height", "2.3");
  frame.setAttribute("material", "color:#1a0e00;roughness:0.9");
  frame.setAttribute("position", "0 0 -0.03");
  group.appendChild(frame);

  const imgSrc = ipfsUrl(metadata.image);
  const img = document.createElement("a-plane");
  img.setAttribute("width", "2.0");
  img.setAttribute("height", "2.0");
  img.setAttribute("material", `src:${imgSrc};crossOrigin:anonymous`);
  group.appendChild(img);

  const labelBg = document.createElement("a-plane");
  labelBg.setAttribute("width", "2.3");
  labelBg.setAttribute("height", "0.7");
  labelBg.setAttribute("position", "0 -1.35 -0.01");
  labelBg.setAttribute("material", "color:#0d0800");
  group.appendChild(labelBg);

  const titleText = metadata.name || `NFT #${tokenId}`;
  group.appendChild(makeText(titleText, "0 -1.18 0.02", "#FFD700", 2.2, 22));
  group.appendChild(makeText(shortAddr(owner), "0 -1.45 0.02", "#c8a96e", 1.8, 20));
  group.appendChild(makeText(`#${tokenId}`, "-0.9 1.1 0.02", "#FFD700", 1.4, 10));

  scene.appendChild(group);
}

async function loadNFT(scene, tokenId, pos) {
  try {
    const uriHex = await rpcCall("eth_call", [
      { to: CONTRACT, data: encodeCall("0xc87b56dd", tokenId) }, "latest"
    ]);
    const uri = decodeString(uriHex);
    if (!uri) return;

    const metaRes = await fetch(ipfsUrl(uri));
    const metadata = await metaRes.json();

    const ownerHex = await rpcCall("eth_call", [
      { to: CONTRACT, data: encodeCall("0x6352211e", tokenId) }, "latest"
    ]);
    const owner = decodeAddress(ownerHex);

    placeNFT(scene, pos, metadata, tokenId, owner);
  } catch (e) {
    console.warn(`NFT #${tokenId}:`, e);
    placeNFT(scene, pos, { name: `NFT #${tokenId}`, image: null }, tokenId, "");
  }
}

async function buildGallery() {
  const scene = document.querySelector("a-scene");
  for (let i = 0; i < Math.min(TOTAL, WALL_POSITIONS.length); i++) {
    loadNFT(scene, i, WALL_POSITIONS[i]);
    await new Promise(r => setTimeout(r, 150));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  scene.hasLoaded ? buildGallery() : scene.addEventListener("loaded", buildGallery);
});
