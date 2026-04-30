package com.project.insurancebackend;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ImageMerge {

    // Merge 4 image parts into one image
    public static void mergeImage(String[] partPaths, String outputPath) throws IOException {

        BufferedImage part1 = ImageIO.read(new File(partPaths[0]));
        BufferedImage part2 = ImageIO.read(new File(partPaths[1]));
        BufferedImage part3 = ImageIO.read(new File(partPaths[2]));
        BufferedImage part4 = ImageIO.read(new File(partPaths[3]));

        int partWidth = part1.getWidth();
        int partHeight = part1.getHeight();

        int mergedWidth = partWidth * 2;
        int mergedHeight = partHeight * 2;

        BufferedImage merged = new BufferedImage(mergedWidth, mergedHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = merged.createGraphics();

        g2d.drawImage(part1, 0, 0, null);
        g2d.drawImage(part2, partWidth, 0, null);
        g2d.drawImage(part3, 0, partHeight, null);
        g2d.drawImage(part4, partWidth, partHeight, null);

        g2d.dispose();

        ImageIO.write(merged, "png", new File(outputPath));
        System.out.println("✅ Image merged successfully at " + outputPath);
    }

    public static void main(String[] args) throws IOException {
        String[] partPaths = {
                "fragments/part1.png",
                "fragments/part2.png",
                "fragments/part3.png",
                "fragments/part4.png"
        };

        mergeImage(partPaths, "merged.png");
    }
}
