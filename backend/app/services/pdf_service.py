import fitz  # PyMuPDF
import base64
import io
from typing import List, Dict, Tuple, Any

class PDFProcessor:
    @staticmethod
    def extract_text_and_images(pdf_bytes: bytes) -> Tuple[List[str], List[str]]:
        """
        Extracts text per page and renders each page to a base64 encoded PNG image.
        Returns (text_pages, base64_image_pages)
        """
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text_pages = []
        base64_images = []

        for page_num in range(len(doc)):
            page = doc[page_num]
            # Extract plain text layer if present
            text = page.get_text("text")
            text_pages.append(text if text else "")

            # Render page to high-res image (2x scale for OCR clarity)
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            img_bytes = pix.tobytes("png")
            b64_str = base64.b64encode(img_bytes).decode("utf-8")
            base64_images.append(b64_str)

        doc.close()
        return text_pages, base64_images

    @staticmethod
    def get_pdf_metadata(pdf_bytes: bytes) -> Dict[str, Any]:
        """
        Quickly inspects PDF page count and info dictionary.
        """
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        meta = {
            "page_count": len(doc),
            "title": doc.metadata.get("title", ""),
            "author": doc.metadata.get("author", ""),
        }
        doc.close()
        return meta
