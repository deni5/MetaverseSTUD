const CONTRACT = "0x19a9D64Fe37e02f7a07f3749fC1c58a6bcEa5E77";
const RPC = "https://rpc.sepolia.org";
const TOTAL = 51;

const ABI_FRAGMENTS = [
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function name() view returns (string)",
];

const WALL_POSITIONS = [
  { x: -12, y: 4, z: -9.6 },
  { x:  -8, y: 4, z: -9.6 },
  { x:  -4, y: 4, z: -9.6 },
  { x:   0, y: 4, z: -9.6 },
  { x:   4, y: 4, z: -9.6 },
  { x:   8, y: 4, z: -9.6 },
  { x:  12, y: 4, z: -9.6 },
  { x: -12, y: 1.5, z: -9.6 },
  { x:  -8, y: 1.5, z: -9.6 },
  { x:  -4, y: 1.5, z: -9.6 },
  { x:   0, y: 1.5, z: -9.6 },
  { x:   4, y: 1.5, z: -9.6 },
  { x:   8, y: 1.5, z: -9.6 },
  { x:  12, y: 1.5, z: -9.6 },
  { x: -14, y: 4,   z: -3, ry: 90 },
  { x: -14, y: 4,   z:  0, ry: 90 },
  { x: -14, y: 4,   z:  3, ry: 90 },
  { x:  14, y: 4,   z: -3, ry: -90 },
  { x:  14, y: 4,   z:  0, ry: -90 },
  { x:  14, y: 4,   z:  3, ry: -90 },
];

function ipfsUrl(uri) {
  if (!uri) return "https://picsum.photos/seed/nft/400/400";
  if (uri.startsWith("ipfs://")) {
    return "https://ipfs.io/ipfs/" + uri.slice(7);
  }
  return uri;
}

async function rpcCall(method
cat > gallery.js << 'GALLEOF'
const CONTRACT = "0x19a9D64Fe37e02f7a07f3749fC1c58a6bcEa5E77";
const RPC = "https://rpc.sepolia.org";
const TOTAL = 51;

const ABI_FRAGMENTS = [
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function name() view returns (string)",
];

const WALL_POSITIONS = [
  { x: -12, y: 4, z: -9.6 },
  { x:  -8, y: 4, z: -9.6 },
  { x:  -4, y: 4, z: -9.6 },
  { x:   0, y: 4, z: -9.6 },
  { x:   4, y: 4, z: -9.6 },
  { x:   8, y: 4, z: -9.6 },
  { x:  12, y: 4, z: -9.6 },
  { x: -12, y: 1.5, z: -9.6 },
  { x:  -8, y: 1.5, z: -9.6 },
  { x:  -4, y: 1.5, z: -9.6 },
  { x:   0, y: 1.5, z: -9.6 },
  { x:   4, y: 1.5, z: -9.6 },
  { x:   8, y: 1.5, z: -9.6 },
  { x:  12, y: 1.5, z: -9.6 },
  { x: -14, y: 4,   z: -3, ry: 90 },
  { x: -14, y: 4,   z:  0, ry: 90 },
  { x: -14, y: 4,   z:  3, ry: 90 },
  { x:  14, y: 4,   z: -3, ry: -90 },
  { x:  14, y: 4,   z:  0, ry: -90 },
  { x:  14, y: 4,   z:  3, ry: -90 },
];

function ipfsUrl(uri) {
  if (!uri) return "https://picsum.photos/seed/nft/400/400";
  if (uri.startsWith("ipfs://")) {
    return "https://ipfs.io/ipfs/" + uri.slice(7);
  }
  return uri;
}

async function rpcCall(method, params) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0", id: 1, method, params
    })
  });
  const data = await res.json();
  return data.result;
}

function encodeTokenURI(tokenId) {
  const selector = "0xc87b56dd";
  const padded = tokenId.toString(16).padStart(64, "0");
  return selector + padded;
}

function encodeOwnerOf(tokenId) {
  const selector = "0x6352211e";
  const padded = tokenId.toString(16).padStart(64, "0");
  return selector + padded;
}

function decodeString(hex) {
  if (!hex || hex === "0x") return "";
  try {
    const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
    const offset = parseInt(clean.slice(0, 64), 16) * 2;
    const length = parseInt(clean.slice(64, 128), 16) * 2;
    const str = clean.slice(128, 128 + length);
    return decodeURIComponent(
      str.replace(/../g, "%$&")
    );
  } catch {
    return "";
  }
}

function decodeAddress(hex) {
  if (!hex || hex === "0x") return "";
  return "0x" + hex.slice(-40);
}

function shortAddress(addr) {
  if (!addr || addr.length < 10) return addr;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function placeNFT(scene, pos, metadata, tokenId, owner) {
  const group = document.createElement("a-entity");
  group.setAttribute("position", `${pos.x} ${pos.y} ${pos.z}`);
  group.setAttribute("rotation", `0 ${pos.ry || 0} 0`);

  const frame = document.createElement("a-plane");
  frame.setAttribute("width", "2.3");
  frame.setAttribute("height", "2.3");
  frame.setAttribute("material", "color:#1a0e00;roughness:0.9;metalness:0.1");
  frame.setAttribute("position", "0 0 -0.03");
  group.appendChild(frame);

  const imgSrc = ipfsUrl(metadata.image);
  const img = document.createElement("a-plane");
  img.setAttribute("width", "2.0");
  img.setAttribute("height", "2.0");
  img.setAttribute("material", `src:${imgSrc};crossOrigin:anonymous`);
  group.appendChild(img);

  const label = document.createElement("a-plane");
  label.setAttribute("width", "2.3");
  label.setAttribute("height", "0.55");
  label.setAttribute("position", "0 -1.3 0");
  label.setAttribute("material", "color:#0d0800;roughness:1");
  group.appendChild(label);

  const title = document.createElement("a-text");
  title.setAttribute("value", metadata.name || `NFT #${tokenId}`);
  title.setAttribute("position", "0 -1.18 0.02");
  title.setAttribute("align", "center");
  title.setAttribute("color", "#ffd700");
  title.setAttribute("width", "3.2");
  group.appendChild(title);

  const ownerEl = document.createElement("a-text");
  ownerEl.setAttribute("value", shortAddress(owner));
  ownerEl.setAttribute("position", "0 -1.42 0.02");
  ownerEl.setAttribute("align", "center");
  ownerEl.setAttribute("color", "#c8a96e");
  ownerEl.setAttribute("width", "2.5");
  group.appendChild(ownerEl);

  const tokenLabel = document.createElement("a-text");
  tokenLabel.setAttribute("value", `#${tokenId}`);
  tokenLabel.setAttribute("position", "-0.95 1.05 0.02");
  tokenLabel.setAttribute("align", "left");
  tokenLabel.setAttribute("color", "#ffd700");
  tokenLabel.setAttribute("width", "1.8");
  group.appendChild(tokenLabel);

  scene.appendChild(group);
}

async function loadNFT(scene, tokenId, pos) {
  try {
    const uriHex = await rpcCall("eth_call", [{
      to: CONTRACT,
      data: encodeTokenURI(tokenId)
    }, "latest"]);

    const uri = decodeString(uriHex);
    if (!uri) return;

    const metaUrl = ipfsUrl(uri);
    const metaRes = await fetch(metaUrl);
    const metadata = await metaRes.json();

    const ownerHex = await rpcCall("eth_call", [{
      to: CONTRACT,
      data: encodeOwnerOf(tokenId)
    }, "latest"]);
    const owner = decodeAddress(ownerHex);

    placeNFT(scene, pos, metadata, tokenId, owner);
  } catch (e) {
    console.warn(`NFT #${tokenId} failed:`, e);
    placeNFT(scene, pos, { name: `NFT #${tokenId}`, image: null }, tokenId, "");
  }
}

async function buildGallery() {
  const scene = document.querySelector("a-scene");
  const ids = Array.from({ length: TOTAL }, (_, i) => i);

  const batch = ids.slice(0, WALL_POSITIONS.length);

  for (let i = 0; i < batch.length; i++) {
    loadNFT(scene, batch[i], WALL_POSITIONS[i]);
    await new Promise(r => setTimeout(r, 120));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  if (scene.hasLoaded) {
    buildGallery();
  } else {
    scene.addEventListener("loaded", buildGallery);
  }
});
