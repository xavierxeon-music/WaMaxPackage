#ifndef OverviewGraphH
#define OverviewGraphH

#include <QGraphicsView>

#include <QGraphicsScene>
#include <QJsonObject>

namespace Overview
{
   class Graph : public QGraphicsView
   {
      Q_OBJECT
   public:
      Graph(QWidget* parent);

   public:
      void load(const QString& patchFileName);

   private:
      struct Box
      {
         QGraphicsRectItem* rectItem = nullptr;
         QGraphicsSimpleTextItem* textItem = nullptr;
         int inletCount = 0;
         int outletCount = 0;
      };

      using IdMap = QMap<QString, Box>;

   private:
      IdMap makeObjects(const QJsonObject patcherObject);
      void moveItems(const IdMap& idMap);
      void makeLines(const QJsonObject patcherObject, const IdMap& idMap);

   private:
      QGraphicsScene* scene;

      QPen blackPen;
      QBrush whiteBrush;
      QBrush grayBrush;
      QFont font;
   };
} // namespace Overview

#endif // NOT OverviewGraphH
