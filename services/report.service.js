const PDFDocument = require('pdfkit');

class ReportGenerator {
  static generateAttendanceReport(studentData, attendanceRecords) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('Attendance Report', { align: 'center' });
        doc.moveDown();

        // Student Info
        doc.fontSize(12).font('Helvetica-Bold').text('Student Information:');
        doc.fontSize(11).font('Helvetica');
        doc.text(`Name: ${studentData.fullName}`);
        doc.text(`Class: ${studentData.class}`);
        doc.text(`Age: ${studentData.age}`);
        doc.moveDown();

        // Attendance Summary
        const presentCount = attendanceRecords.filter((r) => r.status === 'present').length;
        const absentCount = attendanceRecords.filter((r) => r.status === 'absent').length;
        const total = attendanceRecords.length;
        const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

        doc.fontSize(12).font('Helvetica-Bold').text('Attendance Summary:');
        doc.fontSize(11).font('Helvetica');
        doc.text(`Total Days: ${total}`);
        doc.text(`Present: ${presentCount}`);
        doc.text(`Absent: ${absentCount}`);
        doc.text(`Percentage: ${percentage}%`);
        doc.moveDown();

        // Detailed Records Table
        if (attendanceRecords.length > 0) {
          doc.fontSize(12).font('Helvetica-Bold').text('Detailed Records:');
          doc.moveDown(0.5);

          const tableTop = doc.y;
          const col1 = 50;
          const col2 = 250;
          const col3 = 450;
          const rowHeight = 25;

          // Table Header
          doc.fontSize(10).font('Helvetica-Bold');
          doc.text('Date', col1, tableTop);
          doc.text('Status', col2, tableTop);
          doc.text('Marked By', col3, tableTop);

          // Divider
          doc.moveTo(col1, tableTop + 15).lineTo(550, tableTop + 15).stroke();

          // Table Rows
          doc.font('Helvetica').fontSize(9);
          attendanceRecords.forEach((record, index) => {
            const y = tableTop + 20 + index * rowHeight;
            doc.text(record.date, col1, y);
            doc.text(record.status.toUpperCase(), col2, y);
            doc.text(record.markedBy || 'N/A', col3, y);
          });
        }

        doc.moveDown(2);
        doc.fontSize(10).font('Helvetica').text(`Report Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  static generatePerformanceReport(studentData, marksRecords) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('Performance Report', { align: 'center' });
        doc.moveDown();

        // Student Info
        doc.fontSize(12).font('Helvetica-Bold').text('Student Information:');
        doc.fontSize(11).font('Helvetica');
        doc.text(`Name: ${studentData.fullName}`);
        doc.text(`Class: ${studentData.class}`);
        doc.text(`Age: ${studentData.age}`);
        doc.moveDown();

        // Performance Summary
        if (marksRecords.length > 0) {
          const scores = marksRecords.map((m) => m.score);
          const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          const topScore = Math.max(...scores);
          const lowestScore = Math.min(...scores);
          const subjects = [...new Set(marksRecords.map((m) => m.subject))];

          doc.fontSize(12).font('Helvetica-Bold').text('Performance Summary:');
          doc.fontSize(11).font('Helvetica');
          doc.text(`Average Score: ${avgScore}`);
          doc.text(`Highest Score: ${topScore}`);
          doc.text(`Lowest Score: ${lowestScore}`);
          doc.text(`Subjects: ${subjects.join(', ')}`);
          doc.moveDown();

          // Marks Table
          if (marksRecords.length > 0) {
            doc.fontSize(12).font('Helvetica-Bold').text('Detailed Marks:');
            doc.moveDown(0.5);

            const tableTop = doc.y;
            const col1 = 50;
            const col2 = 200;
            const col3 = 320;
            const col4 = 420;
            const rowHeight = 25;

            // Table Header
            doc.fontSize(10).font('Helvetica-Bold');
            doc.text('Subject', col1, tableTop);
            doc.text('Score', col2, tableTop);
            doc.text('Grade', col3, tableTop);
            doc.text('Term', col4, tableTop);

            // Divider
            doc.moveTo(col1, tableTop + 15).lineTo(500, tableTop + 15).stroke();

            // Table Rows
            doc.font('Helvetica').fontSize(9);
            marksRecords.forEach((mark, index) => {
              const y = tableTop + 20 + index * rowHeight;
              if (y > doc.page.height - 50) {
                doc.addPage();
              }
              doc.text(mark.subject, col1, y);
              doc.text(mark.score, col2, y);
              doc.text(mark.grade || 'N/A', col3, y);
              doc.text(mark.term || 'N/A', col4, y);
            });
          }
        } else {
          doc.fontSize(11).font('Helvetica').text('No marks recorded yet.');
        }

        doc.moveDown(2);
        doc.fontSize(10).font('Helvetica').text(`Report Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  static generateReportCard(studentData, marksRecords, attendanceRecords) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(22).font('Helvetica-Bold').text('Report Card', { align: 'center' });
        doc.moveDown();

        // Student Info
        doc.fontSize(12).font('Helvetica-Bold').text('Student Information:');
        doc.fontSize(11).font('Helvetica');
        doc.text(`Name: ${studentData.fullName}`);
        doc.text(`Class: ${studentData.class}`);
        doc.text(`Age: ${studentData.age}`);
        doc.moveDown();

        // Attendance Section
        const presentCount = attendanceRecords.filter((r) => r.status === 'present').length;
        const absentCount = attendanceRecords.filter((r) => r.status === 'absent').length;
        const totalDays = attendanceRecords.length;
        const attendancePercent = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

        doc.fontSize(12).font('Helvetica-Bold').text('Attendance:');
        doc.fontSize(11).font('Helvetica');
        doc.text(`Total Days: ${totalDays}`);
        doc.text(`Present: ${presentCount}`);
        doc.text(`Absent: ${absentCount}`);
        doc.text(`Attendance Rate: ${attendancePercent}%`);
        doc.moveDown();

        // Academic Performance
        if (marksRecords.length > 0) {
          const scores = marksRecords.map((m) => m.score);
          const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          const subjectPerformance = {};

          marksRecords.forEach((mark) => {
            if (!subjectPerformance[mark.subject]) {
              subjectPerformance[mark.subject] = [];
            }
            subjectPerformance[mark.subject].push(mark.score);
          });

          doc.fontSize(12).font('Helvetica-Bold').text('Academic Performance:');
          doc.fontSize(11).font('Helvetica');
          doc.text(`Overall Average: ${avgScore}`);

          doc.moveDown(0.5);
          doc.fontSize(10).font('Helvetica-Bold').text('Subject-wise Performance:');
          doc.fontSize(9).font('Helvetica');

          Object.entries(subjectPerformance).forEach(([subject, scores]) => {
            const subAvg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
            doc.text(`${subject}: ${subAvg}`);
          });
        }

        doc.moveDown(2);
        doc.fontSize(10).font('Helvetica').text(`Report Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.fontSize(9).font('Helvetica-Oblique').text('This is an official academic report.', { align: 'center' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = ReportGenerator;
