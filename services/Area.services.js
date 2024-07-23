const Area = require('../models/Area.model');

class AreaService {
    async createArea(data, userId) {
        try {
            if (!data.Image) {
                throw new Error('Missing image file');
            }

            const area = await Area.create({
                User_id: userId,
                Area_type: data.Area_type,
                Name: data.Name,
                Address: data.Address,
                description: data.Description || null,
                Area_status: data.Area_status || 1,
                Image: {
                    id: data.Image.id,
                    url: data.Image.url
                }
            });

            return area;
        } catch (error) {
            throw new Error('Error creating area: ' + error.message);
        }
    }

    async updateArea(areaId, data, userId) {
        try {
            const area = await Area.findOne({ where: { id: areaId, User_id: userId } });
            if (!area) {
                throw new Error('Area not found or not authorized');
            }

            if (data.Image && (!data.Image.id || !data.Image.url)) {
                throw new Error('Invalid image data');
            }

            area.Area_type = data.Area_type || area.Area_type;
            area.Name = data.Name || area.Name;
            area.Address = data.Address || area.Address;
            area.Description = data.Description || area.Description;
            area.Product_code = data.Product_code || area.Product_code;
            area.Area_status = data.Area_status || area.Area_status;
            if (data.Image) {
                area.Image = {
                    id: data.Image.id,
                    url: data.Image.url
                };
            }

            await area.save();

            return area;
        } catch (error) {
            throw new Error('Error updating area: ' + error.message);
        }
    }
    async toggleAreaStatus(areaId, userId) {
        try {
            const area = await Area.findOne({ where: { id: areaId, User_id: userId } });
            if (!area) {
                throw new Error('Area not found or not authorized');
            }

            area.Area_status = area.Area_status === 1 ? 2 : 1;
            await area.save();

            return area;
        } catch (error) {
            throw new Error('Error changing area status: ' + error.message);
        }
    }
    async getAllAreas() {
        try {
            const areas = await Area.findAll();
            return areas;
        } catch (error) {
            throw new Error('Error fetching areas: ' + error.message);
        }
    }
}

module.exports = new AreaService();
