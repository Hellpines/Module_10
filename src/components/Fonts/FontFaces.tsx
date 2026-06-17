const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const fontFaces = `
@font-face {
    font-family: 'Inter';
    src: url('${basePath}/fonts/Inter-VariableFont_opsz%2Cwght.ttf') format('truetype');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'Poppins';
    src: url('${basePath}/fonts/Poppins-VariableFont_wght.otf') format('opentype');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
}
`;

export function FontFaces() {
    return <style dangerouslySetInnerHTML={{ __html: fontFaces }} />;
}
